import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = () => (
    <Svg width={13} height={13} fill="none">
        <G fill="#8F8F8F" clipPath="url(#a)">
            <Path d="M4.81 2.492c-.432-1.875-3.255-1.88-3.688 0-.254 1.1.444 2.03 1.051 2.61a1.163 1.163 0 0 0 1.587 0c.607-.58 1.3-1.51 1.05-2.61Zm-1.825.866a.543.543 0 0 1-.541-.541c0-.298.238-.542.536-.542h.005a.54.54 0 0 1 .542.542.54.54 0 0 1-.542.541ZM11.868 8.992c-.433-1.875-3.266-1.88-3.705 0-.254 1.1.444 2.03 1.056 2.61a1.17 1.17 0 0 0 1.593 0c.612-.58 1.31-1.51 1.056-2.61Zm-1.83.866a.543.543 0 0 1-.542-.541c0-.298.238-.542.536-.542h.005c.298 0 .542.244.542.542a.543.543 0 0 1-.542.541ZM6.5 10.698H5.05a1.47 1.47 0 0 1-1.392-.964 1.48 1.48 0 0 1 .411-1.647l4.328-3.786a.672.672 0 0 0 .19-.748.666.666 0 0 0-.634-.438H6.5a.41.41 0 0 1-.406-.407.41.41 0 0 1 .406-.406h1.452c.628 0 1.176.38 1.392.964a1.48 1.48 0 0 1-.411 1.647L4.605 8.7a.672.672 0 0 0-.19.748.666.666 0 0 0 .634.439H6.5a.41.41 0 0 1 .407.406.41.41 0 0 1-.407.406Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h13v13H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
