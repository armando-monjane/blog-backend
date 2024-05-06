

export class PaginatedRequest {
	page: number = 1;
	limit: number = 10  ;
	search: string = '';
	sort: string = '';
	order: string = '';

	getAll() {
		return{
			skip: (Number(this.page - 1)) * Number(this.limit),
			take: Number(this.limit),
		}
	}
}