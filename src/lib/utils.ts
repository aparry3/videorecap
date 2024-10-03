export const toQueryString = (params: {[key: string]: string | string[] | undefined}, exclude?: string[]) => {
    const strings: string[] = []
    console.log("PARAMS:", params)
    if (Object.keys(params).length === 0) return ''

    Object.entries(params).forEach(([key, value]) => {
        if (exclude && exclude.includes(key)) return
        if (Array.isArray(value)) {
            value.forEach((v) => {
                strings.push(`${key}=${v}`)
            })
        } else if (value !== undefined) {
            strings.push(`${key}=${value}`)
        }
    })
    
    return strings.length ? `?${strings.join('&')}` : ''
}