/** Indian digit grouping, e.g. 132000 -> "1,32,000". */
export const formatNumber = (value: number) => value.toLocaleString('en-IN')

export const formatRupees = (value: number) => `₹${formatNumber(value)}`
