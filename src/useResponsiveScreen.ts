import { useDimensions } from '@react-native-community/hooks'
import { PixelRatio, ScaledSize } from 'react-native'

type Percent = number | string

const widthPercentageToDP = (width, widthPercent) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent)
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100)
}

const heightPercentageToDP = (height, heightPercent) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent)
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100)
}

const getResponsiveScreen = (dimensions: ScaledSize) => {
  const { width, height } = dimensions
  return {
    vw: (percent: Percent) => widthPercentageToDP(width, percent),
    vh: (percent: Percent) => heightPercentageToDP(height, percent),
  }
}

const useResponsiveScreen = () => {
  const dimensions = useDimensions().window
  return getResponsiveScreen(dimensions)
}

export default useResponsiveScreen
