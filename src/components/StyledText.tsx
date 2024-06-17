import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}

export function SFProText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SFProDisplay' }]} />;
}
