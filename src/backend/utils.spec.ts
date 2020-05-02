import { head } from 'lodash'
import { parseNHK, parseFile, findWordByKanji, writeToDB } from './utils'

const wordList = parseFile()

describe('validation', () => {
	it('can parse correctly formed json', () => {
		const parsed = head(findWordByKanji('有る', wordList))
		expect(parsed.hiragana).toEqual([ 'ある' ])
		expect(parsed.katakana).toEqual([ 'アル' ])
		expect(parsed.kanji).toEqual([ '有る', '在る' ])
		expect(parsed.readings.length).toEqual(1)
		expect(head(parsed.readings).audioFile).toEqual('ある.yomi000142BB_0596.wav')
		expect(head(parsed.readings).downstep).toEqual(0)
	})

	it('it return null if given null', () => {
		expect(parseNHK(null)).toBeNull()
	})

	it('it return null if given strange object', () => {
		expect(parseNHK({ dasd: 'das' })).toBeNull()
	})
})

describe('correctness', () => {
	it('daigaku', () => {
		const parsed: any = head(head(findWordByKanji('大学', wordList)).readings)
		expect(parsed.downstep).toEqual(-1)
	})

	it('imouto', () => {
		const parsed: any = head(head(findWordByKanji('妹', wordList)).readings)
		expect(parsed.downstep).toEqual(3)
	})

	it('busaiku', () => {
		const parsed: any = head(head(findWordByKanji('不細工', wordList)).readings)
		expect(parsed.downstep).toEqual(1)
	})
	it('hashi - bridge', () => {
		const parsed: any = head(head(findWordByKanji('橋', wordList)).readings)
		expect(parsed.downstep).toEqual(1)
	})
	it('hashi - chopsticks', () => {
		const parsed: any = head(head(findWordByKanji('箸', wordList)).readings)
		expect(parsed.downstep).toEqual(0)
	})

	it('hashi - edge', () => {
		const word = head(findWordByKanji('端', wordList))
		expect(word.readings).toEqual([
			{ audioFile: '端.yomi00094DEE_039E.wav', downstep: 0 },
			{ audioFile: '端.yomi00094DF5_0212.wav', downstep: 0 },
			{ audioFile: '端.yomi00094E05_0116.wav', downstep: -1 },
			{ audioFile: '端.yomi00094E12_0152.wav', downstep: -1 },
			{ audioFile: '端.yomi00094E1D_0696.wav', downstep: -1 },
		])
	})
	it('is a wrod with more readings than hiraganas', () => {
		const bad =
			// wordList.filter((x) => x.hiragana.length > 1 && x.readings.length > x.hiragana.length)
			wordList.filter((x) => x.hiragana.length === 1 && x.readings.length > 3)
		console.log(bad)
	})
})
describe('db', () => {
	// writeToDB(wordList)
})

//TODO how can we know which yomi audifile correponds to which hiragana?
//TODO how can we know which joshi audiofile coresponds to which accent?
//TODO some words have multiple downsteps checkout "ほぞのお"
