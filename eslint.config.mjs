import nextConfig from "eslint-config-next/flat";
export default [...nextConfig, {rules:{"@typescript-eslint/no-explicit-any":"off"}}];
