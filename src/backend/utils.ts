import { head, last, take } from 'lodash'
import { readFileSync } from 'fs-extra'

export const greeting = () => 'Hello World'

type NHK = {
	jisho: string
	kanji: string
	hiragana: string
	readings: Reading[]
	jishoWord: string
	katakana: string
}

type Reading = {
	audioFile: string
	downstep: number
}

export const parseUntil = (word) => parseFile().find((x) => x.kanji.includes(word))

export const parseFile = () => {
	return JSON.parse(readFileSync('dict.json').toString())
		.filter((x: any) => x && x.nhk)
		.map((x: any) => parseNHK(x.nhk))
}
export const parseNHK = (obj: any) => parseNHKObject(obj, downsteps)

const parseNHKObject = (obj: any, downsteps: string[]): NHK | null => {
	try {
		return {
			jisho: obj.jisho,
			kanji: obj.kanji,
			hiragana: obj.kana,
			jishoWord: obj.jishoWord,
			katakana: obj.katakana,
			readings: obj.yomi.map((x: any) => ({
				audioFile: head(x),
				downstep: last<string[]>(x).findIndex((f: string) => downsteps.includes(f)),
			})),
		}
	} catch (e) {
		return null
	}
}

export const downsteps = [
	'00002FDE_0232.jpg',
	'00002FDF_0119.jpg',
	'00002FE0_05C1.jpg',
	'00002FE3_0510.jpg',
	'00002FE6_040C.jpg',
	'00002FE8_04E6.jpg',
	'00002FEC_036B.jpg',
	'00002FF1_033E.jpg',
	'00002FF5_07B3.jpg',
	'00002FF8_06FA.jpg',
	'00002FF9_058D.jpg',
	'00002FFA_045B.jpg',
	'00003000_061A.jpg',
	'00003003_0224.jpg',
	'00003004_07A2.jpg',
	'00003005_065E.jpg',
	'00003007_040D.jpg',
	'00003007_0787.jpg',
	'00003009_01B0.jpg',
	'0000300B_0275.jpg',
	'0000300B_05FB.jpg',
	'0000300C_017A.jpg',
	'0000300D_0053.jpg',
	'0000300F_0784.jpg',
	'00003010_02F3.jpg',
	'00003010_0668.jpg',
	'00003012_00BB.jpg',
	'00003012_07FA.jpg',
	'00003014_0225.jpg',
	'00003014_059F.jpg',
	'00003017_010A.jpg',
	'00003017_0489.jpg',
	'0000301A_0465.jpg',
	'0000301A_07ED.jpg',
	'0000301B_0373.jpg',
	'0000301D_07DB.jpg',
	'0000301E_0351.jpg',
	'0000301E_06D8.jpg',
	'0000301F_0259.jpg',
	'00003020_0144.jpg',
	'00003020_04BB.jpg',
	'00003021_039E.jpg',
	'00003022_0294.jpg',
	'00003022_0619.jpg',
	'00003023_01A2.jpg',
	'00003023_0526.jpg',
	'00003024_0096.jpg',
	'00003024_0712.jpg',
	'00003025_0259.jpg',
	'00003026_010A.jpg',
	'00003028_01D2.jpg',
	'0000302A_0270.jpg',
	'0000302B_012B.jpg',
	'0000302C_068B.jpg',
	'0000302D_057D.jpg',
	'0000302F_05D6.jpg',
	'00003033_00BA.jpg',
	'00003033_042B.jpg',
	'00003035_01B8.jpg',
	'00003035_053E.jpg',
	'00003036_07B3.jpg',
	'00003037_0322.jpg',
	'00003039_00BC.jpg',
	'0000303A_02A9.jpg',
	'0000303C_0393.jpg',
	'0000303D_0254.jpg',
	'0000303E_0480.jpg',
	'0000303F_0364.jpg',
	'0000303F_06DB.jpg',
	'00003040_0259.jpg',
	'00003040_05CA.jpg',
	'00003041_0140.jpg',
	'00003042_033C.jpg',
	'00003042_06B7.jpg',
	'00003044_00E3.jpg',
	'00003044_047F.jpg',
	'00003045_0392.jpg',
	'00003047_04DC.jpg',
	'00003048_0057.jpg',
	'00003048_03CB.jpg',
	'00003048_0750.jpg',
	'0000304B_0092.jpg',
	'0000304B_0430.jpg',
	'0000304B_07CB.jpg',
	'0000304C_06F5.jpg',
	'0000304D_0299.jpg',
	'0000304E_01B6.jpg',
	'0000304E_07FD.jpg',
	'0000304F_069D.jpg',
	'00003051_0046.jpg',
	'00003051_06EE.jpg',
]
