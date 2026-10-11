
import dns from "node:dns/promises";
import net from "node:net";
import tls from "node:tls";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is missing");
  process.exitCode = 1;
} else {
  const parsed = new URL(uri);
  const hostname = parsed.hostname;

  async function testDNS() {
    console.log("1. Testing DNS...");

    try {
      if (parsed.protocol === "mongodb+srv:") {
        const records = await dns.resolveSrv(
          `_mongodb._tcp.${hostname}`
        );

        console.log("DNS SRV: OK");
        return records.map((record) => ({
          host: record.name,
          port: record.port,
        }));
      }

      const addresses = await dns.lookup(hostname);
      console.log("DNS: OK");

      return [{ host: addresses.address, port: 27017 }];
    } catch (error) {
      console.error("DNS failed:", error.code);
      return [];
    }
  }

  function testTCP(host, port) {
    return new Promise((resolve) => {
      console.log("2. Testing TCP connection...");

      const socket = net.connect({ host, port });
      socket.setTimeout(10000);

      socket.once("connect", () => {
        console.log("TCP: OK");
        socket.destroy();
        resolve(true);
      });

      socket.once("error", (error) => {
        console.error("TCP failed:", error.code);
        socket.destroy();
        resolve(false);
      });

      socket.once("timeout", () => {
        console.error("TCP: TIMEOUT");
        socket.destroy();
        resolve(false);
      });
    });
  }

  function testTLS(host, port) {
    return new Promise((resolve) => {
      console.log("3. Testing TLS handshake...");

      const socket = tls.connect({
        host,
        port,
        servername: host,
        rejectUnauthorized: true,
      });

      socket.setTimeout(10000);

      socket.once("secureConnect", () => {
        console.log("TLS: OK");
        console.log("Protocol:", socket.getProtocol());
        socket.end();
        resolve(true);
      });

      socket.once("error", (error) => {
        console.error("TLS failed:", error.code);
        console.error("Reason:", error.message);
        socket.destroy();
        resolve(false);
      });

      socket.once("timeout", () => {
        console.error("TLS: TIMEOUT");
        socket.destroy();
        resolve(false);
      });
    });
  }

  const servers = await testDNS();

  if (servers.length > 0) {
    const { host, port } = servers[0];

    const tcpOK = await testTCP(host, port);

    if (tcpOK) {
      await testTLS(host, port);
    }
  }

  console.log("MongoDB network diagnostic finished.");
}
