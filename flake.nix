{
  description = "Kosensai2026 development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs = { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system:
          f {
            pkgs = import nixpkgs { inherit system; };
          });
    in
    {
      devShells = forAllSystems ({ pkgs }: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_22
            python3
            gcc
            gnumake
          ];

          shellHook = ''
            export PNPM_HOME="$PWD/.pnpm-home"
            export PATH="$PNPM_HOME:$PATH"

            mkdir -p "$PNPM_HOME"

            if command -v corepack >/dev/null 2>&1; then
              corepack enable --install-directory "$PNPM_HOME"
              corepack prepare pnpm@9.15.4 --activate
            fi
          '';
        };
      });
    };
}
