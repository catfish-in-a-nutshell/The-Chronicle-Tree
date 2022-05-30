function weighted_choice(weights) {
    let rnd = weights.reduce( (l, r) => l+r ) * Math.random()
    return weights.findIndex( a => (rnd -= a) <= 0)
}