import _ from "lodash";

export function clone2dArray<T>(arr: T[][]): T[][] {
	var ret: T[][] = [];
	arr.forEach((row, i) => {
		row.forEach((e, j) => {
			ret[i] = ret[i] || [];
			ret[i][j] = e;
		})
	});
	return ret;
}

export function shuffleArrayAfterIndex<T>(arr: T[], index: number) {
	const head = arr.slice(0, index)
	const tail = arr.slice(index, arr.length)
	return head.concat(_.shuffle(tail));
}