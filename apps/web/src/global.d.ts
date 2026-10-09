// グローバル CSS の副作用 import（import './globals.css'）用の型宣言
// TypeScript の noUncheckedSideEffectImports が有効な環境で TS2882 にならないようにする
declare module '*.css'
