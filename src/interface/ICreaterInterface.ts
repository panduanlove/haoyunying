export type hospitalKey =
  'beijingxieheyiyuan' |
  'zhongriyouhaoyiyuan'
;

export type ICreaterInterface = {
  [key in hospitalKey]: () => void
}
