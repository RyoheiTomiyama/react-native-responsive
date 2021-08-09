import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import merge from 'lodash/merge'
import { useMediaQuery, IMediaQuery } from './mediaQuery'
import useResponsiveScreen from './useResponsiveScreen'

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NamedStylesExtends<T = any> = NamedStyles<T> | NamedStyles<any>

export type MediaQueryStyle<T extends NamedStylesExtends<T>> = {
  query?: IMediaQuery
  style: T | NamedStyles<T>
}

type ResponsiveScreenTypes = ReturnType<typeof useResponsiveScreen>

type UseStylesheetParameter<T> = MediaQueryStyle<T> | MediaQueryStyle<T>[]

type UseStylesheetParameterFunc<T> = (args: ResponsiveScreenTypes) => UseStylesheetParameter<T>

const toStyles = <T extends NamedStylesExtends<T>>(styles: UseStylesheetParameter<T>) => {
  const toMediaQueryStyle = (mediaQueryStyle: MediaQueryStyle<T>) => {
    const { query = {}, style } = mediaQueryStyle
    return { query, style }
  }
  if (Array.isArray(styles)) {
    return styles.map(toMediaQueryStyle)
  }
  return [toMediaQueryStyle(styles)]
}

const getStylesheet = <T extends Record<string, unknown>>(styles: MediaQueryStyle<T>[]) => {
  const selectedStyles: NamedStyles<T>[] = []
  styles.forEach(style => (useMediaQuery(style.query) ? selectedStyles.push(style.style) : undefined))
  return merge(...selectedStyles)
}

const useStylesheet = <T extends NamedStylesExtends | UseStylesheetParameterFunc<NamedStylesExtends>>(
  styles: T extends NamedStylesExtends ? UseStylesheetParameter<T | NamedStylesExtends> : T
) => {
  type TT = T extends NamedStylesExtends ? T : T extends UseStylesheetParameterFunc<infer U> ? U : NamedStylesExtends

  if (styles instanceof Function) {
    const { vw, vh } = useResponsiveScreen()
    const s = styles({ vw, vh })
    return getStylesheet(toStyles(s)) as TT
  }
  return getStylesheet(toStyles(styles)) as TT
}

// ## HOW TO USE
// - default > md > xs の順番で指定していく（スタイルを上書きしていく）
// - 型指定を省略する場合は、StyleSheet同様にuseStylesheet([{ ... }])と別変数にせず直接書き込む

// const styles = useStylesheet([
//   {
//     style: {
//       image: {
//         backgroundColor: 'blue',
//       },
//     },
//   },
//   {
//     query: {},
//     style: {
//       image: {
//         backgroundColor: 'red',
//         alignItems: 'center',
//       },
//       hoge: {
//         width: 12,
//       },
//     },
//   },
// ])

// // ### 書き方1 デフォルトArray形
// const styles1 = useStylesheet([
//   {
//     query: {},
//     style: {
//       hoge: {
//         width: 200,
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//     },
//   },
//   {
//     style: {
//       fuga: {
//         width: 100,
//       }
//     }
//   }
// ])

// // ### 書き方2 Object形
// const styles2 = useStylesheet({
//   query: {},
//   style: {
//     hoge: {
//       width: 200,
//     },
//   },
// })

// // ### 書き方3 画面幅に合わせた表示がしたい場合
// const styles3 = useStylesheet(({ vw, vh }) => [
//   {
//     query: {},
//     style: {
//       hoge: {
//         width: vw(100),
//         height: vh(50),
//       },
//     },
//   },
//   {
//     style: {
//       fuga: {
//         height: 100,
//       },
//     },
//   },
// ])
// const styles4 = useStylesheet(({ vw, vh }) => ({
//   query: {},
//   style: {
//     hoge: {
//       width: vw(100),
//       height: vh(50),
//     },
//   },
// }))

export default useStylesheet
