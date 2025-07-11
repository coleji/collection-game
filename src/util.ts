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