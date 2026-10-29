import { useMemo } from 'react'
import { useStadiumLayout } from '../../layout/useStadiumLayout'
import City from './City'
import { buildCityPlan } from './cityPlan'
import Ground from './Ground'
import Sky from './Sky'

/** Everything around the stadium: sky, ground and the surrounding city. */
export default function Environment() {
  const { cameraScale, outerRadiusX, outerRadiusZ } = useStadiumLayout()
  const plan = useMemo(
    () => buildCityPlan(cameraScale, outerRadiusX, outerRadiusZ),
    [cameraScale, outerRadiusX, outerRadiusZ],
  )

  return (
    <>
      <Sky cameraScale={cameraScale} />
      <Ground plan={plan} cameraScale={cameraScale} />
      <City plan={plan} />
    </>
  )
}
