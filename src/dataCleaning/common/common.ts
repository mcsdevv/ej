export const parentDir = 'src/dataCleaning/data'
export const imgDir = `${parentDir}/images`
export const kanaDir = `${imgDir}/kana`

export const cleanFiles = (filenames: string[]) =>
    filenames.filter((filename) => {
        const toFilterOut = ['ds_store', 'all', 'downsteps']
        return !toFilterOut.find((bad) => filename.toLowerCase().includes(bad))
    })

export const normalizeStrings = (obj: any) => {
    Object.keys(obj).forEach((x) => {
        if (obj[x] instanceof String) {
            obj[x] = obj[x].normalize()
        }
    })
    return obj
}
