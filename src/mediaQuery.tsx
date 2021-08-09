import React from 'react'
import { PixelRatio, Platform, PlatformOSType } from 'react-native'
import { useDimensions } from '@react-native-community/hooks'

type Orientation = 'landscape' | 'portrait'

export const breakpoints = {
  xs: 340,
  sm: 600,
  // md: 960,
  // lg: 1280,
  // xl: 1800,
} as const

export type Breakpoints = keyof typeof breakpoints

export interface IMediaQuery {
  minHeight?: number
  maxHeight?: number
  minWidth?: number
  maxWidth?: number
  minShortSide?: number
  maxShortSide?: number
  minAspectRatio?: number
  maxAspectRatio?: number
  minPixelRatio?: number
  maxPixelRatio?: number
  orientation?: Orientation
  condition?: boolean
  platform?: PlatformOSType
}

// タブレットをベースに開発してきたので、タブレットサイズをベースにスマホサイズのスタイルを上書きしていく方式を取る
// up, down, betweenに関しては、MUIを参考にした
// https://material-ui.com/ja/customization/breakpoints/
export const mediaQuery = {
  xs: { maxShortSide: breakpoints.xs },
  sm: { maxShortSide: breakpoints.sm },
  up(bp: Breakpoints): IMediaQuery {
    return { minShortSide: breakpoints[bp] + 1 }
  },
  down(bp: Breakpoints): IMediaQuery {
    return { maxShortSide: breakpoints[bp] }
  },
  between(start: Breakpoints, end: Breakpoints): IMediaQuery {
    if (breakpoints[start] < breakpoints[end]) {
      return { minShortSide: breakpoints[start] + 1, maxShortSide: breakpoints[end] }
    }
    return { minShortSide: breakpoints[end] + 1, maxShortSide: breakpoints[start] }
  },
} as const

const isInInterval = (value: number, min?: number, max?: number): boolean =>
  (min === undefined || value >= min) && (max === undefined || value <= max)

export const isMediaQuery = (query: IMediaQuery, dimensions: { width: number; height: number }): boolean => {
  const { width, height } = dimensions
  const currentOrientation: Orientation = width > height ? 'landscape' : 'portrait'
  const shortSide = width < height ? width : height
  return (
    isInInterval(width, query.minWidth, query.maxWidth) &&
    isInInterval(height, query.minHeight, query.maxHeight) &&
    isInInterval(shortSide, query.minShortSide, query.maxShortSide) &&
    isInInterval(width / height, query.minAspectRatio, query.maxAspectRatio) &&
    isInInterval(PixelRatio.get(), query.minPixelRatio, query.maxPixelRatio) &&
    (query.orientation === undefined || query.orientation === currentOrientation) &&
    (query.platform === undefined || query.platform === Platform.OS) &&
    (query.condition === undefined || query.condition)
  )
}
export const useMediaQuery = (query: IMediaQuery): boolean => {
  const { width, height } = useDimensions().window
  return isMediaQuery(query, { width, height })
}

export const MediaQuery: React.FC<IMediaQuery> = props => {
  const val = useMediaQuery(props)
  if (val) {
    return props.children as JSX.Element
  }
  return null
}

export default mediaQuery

// ## HOW TO USE

// const Component: React.FC = () => {
//   return (<>
//     {/* sm => 0 ~ 600 */}
//     <MediaQuery {...mediaQuery.sm}>
//       <Text>this is greater than smart phone</Text>
//     </MediaQuery>
//     {/* up('sm') => up(600) => [x > 600] => 601 ~ ∞ */}
//     <MediaQuery {...mediaQuery.up('sm')}>
//       <Text>this is greater than smart phone</Text>
//     </MediaQuery>
//     {/* down('sm') => down(600) => [x <= 600] => 0 ~ 600 */}
//     <MediaQuery {...mediaQuery.down('sm')}>
//       <Text>this is less than smart phone</Text>
//     </MediaQuery>
//     {/* between('xs', 'sm') => between(340, 600) => [340 < x, x <= 600] => 341 ~ 600 */}
//     <MediaQuery {...mediaQuery.between('xs', 'sm')}>
//       <Text>this is greater than smart phone</Text>
//     </MediaQuery>
//   </>)
// }
