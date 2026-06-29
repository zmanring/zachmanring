// vite.config.ts
import { defineConfig } from "file:///sessions/sweet-intelligent-keller/mnt/zachmanring/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/sweet-intelligent-keller/mnt/zachmanring/node_modules/@vitejs/plugin-react/dist/index.js";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "/sessions/sweet-intelligent-keller/mnt/zachmanring";
function zoneSaverPlugin() {
  return {
    name: "zone-saver",
    configureServer(server) {
      server.middlewares.use("/api/save-zones", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          const dest = path.resolve(__vite_injected_original_dirname, "src/data/zones.json");
          fs.writeFileSync(dest, JSON.stringify(JSON.parse(body), null, 2));
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        });
      });
    }
  };
}
function npcSaverPlugin() {
  return {
    name: "npc-saver",
    configureServer(server) {
      server.middlewares.use("/api/save-npcs", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const defs = JSON.parse(body);
            const filePath = path.resolve(__vite_injected_original_dirname, "src/game/scenes/WorldScene.ts");
            let src = fs.readFileSync(filePath, "utf8");
            const lines = defs.map(
              ([x, y, outfit, radius, id, zone]) => `  [${x}, ${y},  '${outfit}', ${String(radius).padStart(3)}, '${id}', '${zone}'],`
            );
            const newBlock = `const NPC_DEFS: [number, number, string, number, string, string][] = [
${lines.join("\n")}
];`;
            src = src.replace(
              /const NPC_DEFS: \[number, number, string, number, string, string\]\[\] = \[[\s\S]*?\];/,
              newBlock
            );
            fs.writeFileSync(filePath, src, "utf8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.writeHead(500);
            res.end(String(e));
          }
        });
      });
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [react(), zoneSaverPlugin(), npcSaverPlugin()],
  server: {
    port: 3e3
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvc3dlZXQtaW50ZWxsaWdlbnQta2VsbGVyL21udC96YWNobWFucmluZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Nlc3Npb25zL3N3ZWV0LWludGVsbGlnZW50LWtlbGxlci9tbnQvemFjaG1hbnJpbmcvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL3N3ZWV0LWludGVsbGlnZW50LWtlbGxlci9tbnQvemFjaG1hbnJpbmcvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gRGV2LW9ubHkgcGx1Z2luOiBQT1NUIC9hcGkvc2F2ZS16b25lcyB3cml0ZXMgc3JjL2RhdGEvem9uZXMuanNvblxuZnVuY3Rpb24gem9uZVNhdmVyUGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd6b25lLXNhdmVyJyxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyOiBhbnkpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9hcGkvc2F2ZS16b25lcycsIChyZXE6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykgeyByZXMud3JpdGVIZWFkKDQwNSk7IHJlcy5lbmQoKTsgcmV0dXJuOyB9XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIHJlcS5vbignZGF0YScsIChjaHVuazogQnVmZmVyKSA9PiB7IGJvZHkgKz0gY2h1bmsudG9TdHJpbmcoKTsgfSk7XG4gICAgICAgIHJlcS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRlc3QgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2RhdGEvem9uZXMuanNvbicpO1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGVzdCwgSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZShib2R5KSwgbnVsbCwgMikpO1xuICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IG9rOiB0cnVlIH0pKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG4vLyBEZXYtb25seSBwbHVnaW46IFBPU1QgL2FwaS9zYXZlLW5wY3MgcGF0Y2hlcyBOUENfREVGUyBpbiBXb3JsZFNjZW5lLnRzXG5mdW5jdGlvbiBucGNTYXZlclBsdWdpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnbnBjLXNhdmVyJyxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyOiBhbnkpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoJy9hcGkvc2F2ZS1ucGNzJywgKHJlcTogYW55LCByZXM6IGFueSkgPT4ge1xuICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSB7IHJlcy53cml0ZUhlYWQoNDA1KTsgcmVzLmVuZCgpOyByZXR1cm47IH1cbiAgICAgICAgbGV0IGJvZHkgPSAnJztcbiAgICAgICAgcmVxLm9uKCdkYXRhJywgKGNodW5rOiBCdWZmZXIpID0+IHsgYm9keSArPSBjaHVuay50b1N0cmluZygpOyB9KTtcbiAgICAgICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRlZnM6IFtudW1iZXIsIG51bWJlciwgc3RyaW5nLCBudW1iZXIsIHN0cmluZywgc3RyaW5nXVtdID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9nYW1lL3NjZW5lcy9Xb3JsZFNjZW5lLnRzJyk7XG4gICAgICAgICAgICBsZXQgc3JjID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgICAgICAgY29uc3QgbGluZXMgPSBkZWZzLm1hcCgoW3gsIHksIG91dGZpdCwgcmFkaXVzLCBpZCwgem9uZV0pID0+XG4gICAgICAgICAgICAgIGAgIFske3h9LCAke3l9LCAgJyR7b3V0Zml0fScsICR7U3RyaW5nKHJhZGl1cykucGFkU3RhcnQoMyl9LCAnJHtpZH0nLCAnJHt6b25lfSddLGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBuZXdCbG9jayA9IGBjb25zdCBOUENfREVGUzogW251bWJlciwgbnVtYmVyLCBzdHJpbmcsIG51bWJlciwgc3RyaW5nLCBzdHJpbmddW10gPSBbXFxuJHtsaW5lcy5qb2luKCdcXG4nKX1cXG5dO2A7XG4gICAgICAgICAgICBzcmMgPSBzcmMucmVwbGFjZShcbiAgICAgICAgICAgICAgL2NvbnN0IE5QQ19ERUZTOiBcXFtudW1iZXIsIG51bWJlciwgc3RyaW5nLCBudW1iZXIsIHN0cmluZywgc3RyaW5nXFxdXFxbXFxdID0gXFxbW1xcc1xcU10qP1xcXTsvLFxuICAgICAgICAgICAgICBuZXdCbG9ja1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIHNyYywgJ3V0ZjgnKTtcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgb2s6IHRydWUgfSkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwKTsgcmVzLmVuZChTdHJpbmcoZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgem9uZVNhdmVyUGx1Z2luKCksIG5wY1NhdmVyUGx1Z2luKCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgcGhhc2VyOiBbJ3BoYXNlciddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxvQkFBb0I7QUFDclcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQU16QyxTQUFTLGtCQUFrQjtBQUN6QixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixnQkFBZ0IsUUFBYTtBQUMzQixhQUFPLFlBQVksSUFBSSxtQkFBbUIsQ0FBQyxLQUFVLFFBQWE7QUFDaEUsWUFBSSxJQUFJLFdBQVcsUUFBUTtBQUFFLGNBQUksVUFBVSxHQUFHO0FBQUcsY0FBSSxJQUFJO0FBQUc7QUFBQSxRQUFRO0FBQ3BFLFlBQUksT0FBTztBQUNYLFlBQUksR0FBRyxRQUFRLENBQUMsVUFBa0I7QUFBRSxrQkFBUSxNQUFNLFNBQVM7QUFBQSxRQUFHLENBQUM7QUFDL0QsWUFBSSxHQUFHLE9BQU8sTUFBTTtBQUNsQixnQkFBTSxPQUFPLEtB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
