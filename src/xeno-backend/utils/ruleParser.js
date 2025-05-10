export const parseRulesToQuery = (rules) => {
  const mongoConditions = rules.map(rule => {
    const field = rule.field
    const value = rule.value
    const operator = rule.operator

    switch (operator) {
      case '>':
        return { [field]: { $gt: Number(value) } }
      case '<':
        return { [field]: { $lt: Number(value) } }
      case '>=':
        return { [field]: { $gte: Number(value) } }
      case '<=':
        return { [field]: { $lte: Number(value) } }
      case '==':
        return { [field]: { $eq: Number(value) } }  // Fixed
      case 'includes':
        return { [field]: { $regex: value, $options: 'i' } }
      default:
        return {}
    }
  })

  return { $and: mongoConditions }
}
