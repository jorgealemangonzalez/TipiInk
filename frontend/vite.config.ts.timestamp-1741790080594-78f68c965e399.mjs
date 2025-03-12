// vite.config.ts
import { defineConfig } from "file:///Users/jorge/projects/TipiInk/node_modules/.pnpm/vite@5.3.1_@types+node@22.7.2/node_modules/vite/dist/node/index.js";
import react from "file:///Users/jorge/projects/TipiInk/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_@swc+helpers@0.5.5_vite@5.3.1_@types+node@22.7.2_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { sentryVitePlugin } from "file:///Users/jorge/projects/TipiInk/node_modules/.pnpm/@sentry+vite-plugin@2.22.2_encoding@0.1.13/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";

// vite.tools.ts
import path from "path";
import fs from "file:///Users/jorge/projects/TipiInk/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";
import { v2 } from "file:///Users/jorge/projects/TipiInk/node_modules/.pnpm/@google-cloud+translate@8.5.0_encoding@0.1.13/node_modules/@google-cloud/translate/build/src/index.js";
var __vite_injected_original_dirname = "/Users/jorge/projects/TipiInk/frontend";
var translate = new v2.Translate({ projectId: "tipi-ink" });
var queue = [];
var isProcessing = false;
async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  const task = queue.shift();
  if (task) await task();
  isProcessing = false;
  processQueue();
}
function createTranslationsMiddleware() {
  return {
    name: "save-translation-middleware",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "POST") return next();
        const match = req.url.match(/^\/locales\/(?<lng>\w+)\/(?<ns>\w+)\.json$/);
        if (!match || !match.groups) {
          return next();
        }
        console.log("Adding new translations:", req.url);
        const { lng, ns } = match.groups;
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          queue.push(async () => {
            try {
              const translationsPath = path.join(__vite_injected_original_dirname, `public/locales/${lng}/${ns}.json`);
              if (!await fs.pathExists(translationsPath)) {
                await fs.ensureFile(translationsPath);
                await fs.writeJson(translationsPath, {});
              }
              const existingTranslations = await fs.readJson(translationsPath);
              console.log("New translations:", body);
              const newTranslations = JSON.parse(body);
              const updatedTranslations = { ...existingTranslations, ...newTranslations };
              if (lng !== "en") {
                for (const key in newTranslations) {
                  if (Object.prototype.hasOwnProperty.call(newTranslations, key) && !existingTranslations[key]) {
                    console.log("Translating: ", key);
                    const [translation] = await translate.translate(newTranslations[key], lng);
                    updatedTranslations[key] = translation;
                    console.log("Added translation: ", translation);
                  }
                }
              }
              await fs.writeJson(translationsPath, updatedTranslations, { spaces: 2 });
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end("Missing key(s) saved successfully");
            } catch (err) {
              console.error("Failed to update translations", err);
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Failed to update translations");
            }
          });
          processQueue();
        });
      });
    }
  };
}

// vite.config.ts
import path2 from "path";
var __vite_injected_original_dirname2 = "/Users/jorge/projects/TipiInk/frontend";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "innovation-root-sl",
      project: "javascript-react"
    }),
    createTranslationsMiddleware()
  ],
  build: {
    sourcemap: true
  },
  server: {
    headers: {
      "Document-Policy": "js-profiling"
    }
  },
  resolve: {
    alias: {
      "@": path2.resolve(__vite_injected_original_dirname2, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS50b29scy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9qb3JnZS9wcm9qZWN0cy9UaXBpSW5rL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvam9yZ2UvcHJvamVjdHMvVGlwaUluay9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvam9yZ2UvcHJvamVjdHMvVGlwaUluay9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7ZGVmaW5lQ29uZmlnfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB7c2VudHJ5Vml0ZVBsdWdpbn0gZnJvbSAnQHNlbnRyeS92aXRlLXBsdWdpbidcbmltcG9ydCB7Y3JlYXRlVHJhbnNsYXRpb25zTWlkZGxld2FyZX0gZnJvbSBcIi4vdml0ZS50b29sc1wiXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vLyBWaXRlIGNvbmZpZ3VyYXRpb25cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICByZWFjdCgpLFxuICAgICAgICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICAgICAgICAgIG9yZzogJ2lubm92YXRpb24tcm9vdC1zbCcsXG4gICAgICAgICAgICBwcm9qZWN0OiAnamF2YXNjcmlwdC1yZWFjdCcsXG4gICAgICAgIH0pLFxuICAgICAgICBjcmVhdGVUcmFuc2xhdGlvbnNNaWRkbGV3YXJlKCksXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0RvY3VtZW50LVBvbGljeSc6ICdqcy1wcm9maWxpbmcnLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAgIH0sXG4gICAgfSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9qb3JnZS9wcm9qZWN0cy9UaXBpSW5rL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvam9yZ2UvcHJvamVjdHMvVGlwaUluay9mcm9udGVuZC92aXRlLnRvb2xzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9qb3JnZS9wcm9qZWN0cy9UaXBpSW5rL2Zyb250ZW5kL3ZpdGUudG9vbHMudHNcIjtpbXBvcnQge1BsdWdpbiwgVml0ZURldlNlcnZlcn0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IGZzIGZyb20gXCJmcy1leHRyYVwiXG5pbXBvcnQge3YyfSBmcm9tICdAZ29vZ2xlLWNsb3VkL3RyYW5zbGF0ZSdcblxuY29uc3QgdHJhbnNsYXRlID0gbmV3IHYyLlRyYW5zbGF0ZSh7cHJvamVjdElkOiAndGlwaS1pbmsnfSlcblxuY29uc3QgcXVldWU6ICgoKSA9PiBQcm9taXNlPHZvaWQ+KVtdID0gW11cbmxldCBpc1Byb2Nlc3NpbmcgPSBmYWxzZVxuXG5hc3luYyBmdW5jdGlvbiBwcm9jZXNzUXVldWUoKSB7XG4gICAgaWYgKGlzUHJvY2Vzc2luZyB8fCBxdWV1ZS5sZW5ndGggPT09IDApIHJldHVyblxuICAgIGlzUHJvY2Vzc2luZyA9IHRydWVcbiAgICBjb25zdCB0YXNrID0gcXVldWUuc2hpZnQoKVxuICAgIGlmICh0YXNrKSBhd2FpdCB0YXNrKClcbiAgICBpc1Byb2Nlc3NpbmcgPSBmYWxzZVxuICAgIHByb2Nlc3NRdWV1ZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGlvbnNNaWRkbGV3YXJlKCk6IFBsdWdpbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogJ3NhdmUtdHJhbnNsYXRpb24tbWlkZGxld2FyZScsXG4gICAgICAgIGFwcGx5OiAnc2VydmUnLFxuICAgICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyOiBWaXRlRGV2U2VydmVyKSB7XG4gICAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHJldHVybiBuZXh0KClcblxuICAgICAgICAgICAgICAgIC8vIE1hdGNoIHRoZSBVUkwgYWdhaW5zdCB0aGUgZXhwZWN0ZWQgcGF0dGVyblxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcmVxLnVybCEubWF0Y2goL15cXC9sb2NhbGVzXFwvKD88bG5nPlxcdyspXFwvKD88bnM+XFx3KylcXC5qc29uJC8pXG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaCB8fCAhbWF0Y2guZ3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCkgLy8gSWYgdGhlIFVSTCBkb2Vzbid0IG1hdGNoLCBwYXNzIHRvIHRoZSBuZXh0IG1pZGRsZXdhcmVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQWRkaW5nIG5ldyB0cmFuc2xhdGlvbnM6JywgcmVxLnVybClcbiAgICAgICAgICAgICAgICBjb25zdCB7bG5nLCBuc30gPSBtYXRjaC5ncm91cHNcblxuICAgICAgICAgICAgICAgIGxldCBib2R5ID0gJydcbiAgICAgICAgICAgICAgICByZXEub24oJ2RhdGEnLCAoY2h1bmspID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHJlcS5vbignZW5kJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5wdXNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb25zUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIGBwdWJsaWMvbG9jYWxlcy8ke2xuZ30vJHtuc30uanNvbmApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdHJhbnNsYXRpb25zIG5vdCBleGlzdCwgY3JlYXRlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhd2FpdCBmcy5wYXRoRXhpc3RzKHRyYW5zbGF0aW9uc1BhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGZzLmVuc3VyZUZpbGUodHJhbnNsYXRpb25zUGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZnMud3JpdGVKc29uKHRyYW5zbGF0aW9uc1BhdGgsIHt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ1RyYW5zbGF0aW9ucyA9IGF3YWl0IGZzLnJlYWRKc29uKHRyYW5zbGF0aW9uc1BhdGgpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTmV3IHRyYW5zbGF0aW9uczonLCBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhcnNlIHRoZSByZXF1ZXN0IGJvZHkgdG8gZXh0cmFjdCBuZXcgdHJhbnNsYXRpb24ga2V5cyBhbmQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VHJhbnNsYXRpb25zID0gSlNPTi5wYXJzZShib2R5KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWVyZ2UgdGhlIG5ldyB0cmFuc2xhdGlvbnMgd2l0aCB0aGUgZXhpc3Rpbmcgb25lc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRUcmFuc2xhdGlvbnMgPSB7Li4uZXhpc3RpbmdUcmFuc2xhdGlvbnMsIC4uLm5ld1RyYW5zbGF0aW9uc31cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgdHJhbnNsYXRlIG5ldyBrZXlzIGlmIHRoZSBsYW5ndWFnZSBpcyBub3QgRW5nbGlzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsbmcgIT09ICdlbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbmV3VHJhbnNsYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5ld1RyYW5zbGF0aW9ucywga2V5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICFleGlzdGluZ1RyYW5zbGF0aW9uc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVHJhbnNsYXRpbmc6ICcsIGtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbdHJhbnNsYXRpb25dID0gYXdhaXQgdHJhbnNsYXRlLnRyYW5zbGF0ZShuZXdUcmFuc2xhdGlvbnNba2V5XSwgbG5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRUcmFuc2xhdGlvbnNba2V5XSA9IHRyYW5zbGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZGVkIHRyYW5zbGF0aW9uOiAnLCB0cmFuc2xhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdyaXRlIHRoZSB1cGRhdGVkIHRyYW5zbGF0aW9ucyBiYWNrIHRvIHRoZSBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZnMud3JpdGVKc29uKHRyYW5zbGF0aW9uc1BhdGgsIHVwZGF0ZWRUcmFuc2xhdGlvbnMsIHtzcGFjZXM6IDJ9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCdNaXNzaW5nIGtleShzKSBzYXZlZCBzdWNjZXNzZnVsbHknKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHVwZGF0ZSB0cmFuc2xhdGlvbnMnLCBlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIHsnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCdGYWlsZWQgdG8gdXBkYXRlIHRyYW5zbGF0aW9ucycpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NRdWV1ZSgpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUyxTQUFRLG9CQUFtQjtBQUMvVCxPQUFPLFdBQVc7QUFDbEIsU0FBUSx3QkFBdUI7OztBQ0QvQixPQUFPLFVBQVU7QUFDakIsT0FBTyxRQUFRO0FBQ2YsU0FBUSxVQUFTO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU0sWUFBWSxJQUFJLEdBQUcsVUFBVSxFQUFDLFdBQVcsV0FBVSxDQUFDO0FBRTFELElBQU0sUUFBaUMsQ0FBQztBQUN4QyxJQUFJLGVBQWU7QUFFbkIsZUFBZSxlQUFlO0FBQzFCLE1BQUksZ0JBQWdCLE1BQU0sV0FBVyxFQUFHO0FBQ3hDLGlCQUFlO0FBQ2YsUUFBTSxPQUFPLE1BQU0sTUFBTTtBQUN6QixNQUFJLEtBQU0sT0FBTSxLQUFLO0FBQ3JCLGlCQUFlO0FBQ2YsZUFBYTtBQUNqQjtBQUVPLFNBQVMsK0JBQXVDO0FBQ25ELFNBQU87QUFBQSxJQUNILE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLGdCQUFnQixRQUF1QjtBQUNuQyxhQUFPLFlBQVksSUFBSSxPQUFPLEtBQUssS0FBSyxTQUFTO0FBQzdDLFlBQUksSUFBSSxXQUFXLE9BQVEsUUFBTyxLQUFLO0FBR3ZDLGNBQU0sUUFBUSxJQUFJLElBQUssTUFBTSw0Q0FBNEM7QUFDekUsWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLFFBQVE7QUFDekIsaUJBQU8sS0FBSztBQUFBLFFBQ2hCO0FBRUEsZ0JBQVEsSUFBSSw0QkFBNEIsSUFBSSxHQUFHO0FBQy9DLGNBQU0sRUFBQyxLQUFLLEdBQUUsSUFBSSxNQUFNO0FBRXhCLFlBQUksT0FBTztBQUNYLFlBQUksR0FBRyxRQUFRLENBQUMsVUFBVTtBQUN0QixrQkFBUSxNQUFNLFNBQVM7QUFBQSxRQUMzQixDQUFDO0FBRUQsWUFBSSxHQUFHLE9BQU8sWUFBWTtBQUN0QixnQkFBTSxLQUFLLFlBQVk7QUFDbkIsZ0JBQUk7QUFDQSxvQkFBTSxtQkFBbUIsS0FBSyxLQUFLLGtDQUFXLGtCQUFrQixHQUFHLElBQUksRUFBRSxPQUFPO0FBRWhGLGtCQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsZ0JBQWdCLEdBQUc7QUFDeEMsc0JBQU0sR0FBRyxXQUFXLGdCQUFnQjtBQUNwQyxzQkFBTSxHQUFHLFVBQVUsa0JBQWtCLENBQUMsQ0FBQztBQUFBLGNBQzNDO0FBQ0Esb0JBQU0sdUJBQXVCLE1BQU0sR0FBRyxTQUFTLGdCQUFnQjtBQUUvRCxzQkFBUSxJQUFJLHFCQUFxQixJQUFJO0FBRXJDLG9CQUFNLGtCQUFrQixLQUFLLE1BQU0sSUFBSTtBQUd2QyxvQkFBTSxzQkFBc0IsRUFBQyxHQUFHLHNCQUFzQixHQUFHLGdCQUFlO0FBR3hFLGtCQUFJLFFBQVEsTUFBTTtBQUNkLDJCQUFXLE9BQU8saUJBQWlCO0FBQy9CLHNCQUNJLE9BQU8sVUFBVSxlQUFlLEtBQUssaUJBQWlCLEdBQUcsS0FDdEQsQ0FBQyxxQkFBcUIsR0FBRyxHQUM5QjtBQUNFLDRCQUFRLElBQUksaUJBQWlCLEdBQUc7QUFDaEMsMEJBQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxVQUFVLFVBQVUsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHO0FBQ3pFLHdDQUFvQixHQUFHLElBQUk7QUFDM0IsNEJBQVEsSUFBSSx1QkFBdUIsV0FBVztBQUFBLGtCQUNsRDtBQUFBLGdCQUNKO0FBQUEsY0FDSjtBQUdBLG9CQUFNLEdBQUcsVUFBVSxrQkFBa0IscUJBQXFCLEVBQUMsUUFBUSxFQUFDLENBQUM7QUFFckUsa0JBQUksVUFBVSxLQUFLLEVBQUMsZ0JBQWdCLGFBQVksQ0FBQztBQUNqRCxrQkFBSSxJQUFJLG1DQUFtQztBQUFBLFlBQy9DLFNBQVMsS0FBSztBQUNWLHNCQUFRLE1BQU0saUNBQWlDLEdBQUc7QUFDbEQsa0JBQUksVUFBVSxLQUFLLEVBQUMsZ0JBQWdCLGFBQVksQ0FBQztBQUNqRCxrQkFBSSxJQUFJLCtCQUErQjtBQUFBLFlBQzNDO0FBQUEsVUFDSixDQUFDO0FBQ0QsdUJBQWE7QUFBQSxRQUNqQixDQUFDO0FBQUEsTUFDTCxDQUFDO0FBQUEsSUFDTDtBQUFBLEVBQ0o7QUFDSjs7O0FEdEZBLE9BQU9BLFdBQVU7QUFKakIsSUFBTUMsb0NBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGlCQUFpQjtBQUFBLE1BQ2IsS0FBSztBQUFBLE1BQ0wsU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsNkJBQTZCO0FBQUEsRUFDakM7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILFdBQVc7QUFBQSxFQUNmO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixTQUFTO0FBQUEsTUFDTCxtQkFBbUI7QUFBQSxJQUN2QjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUtDLE1BQUssUUFBUUMsbUNBQVcsT0FBTztBQUFBLElBQ3hDO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSJdCn0K
