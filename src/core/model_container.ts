export class ModelContainer<T>{
	items:T[];
	currentItemCount:number;
	itemsPerPage?:number;
	startIndex?:number;
	totalItems?:number;
	pageIndex?:number;
	totalPages?:number;
	kind?:string;
	constructor(items: T[])
	{
		this.items = items;
		this.currentItemCount = items.length;
	}
	public static fromOneItem<T>(item:T) : ModelContainer<T>{
		return new ModelContainer<T>([item]);
	}

	public static fromOtherModel<T, S>(items: T[], otherModel:ModelContainer<S>) : ModelContainer<T>{
		const nmodel = new ModelContainer<T>(items);
		nmodel.copyToMe(otherModel.getForCopy());
		return nmodel;
	}

	public copyToMe(data:{currentItemCount:number,
		itemsPerPage?:number,
		startIndex?:number,
		totalItems?:number,
		pageIndex?:number,
		totalPages?:number,
		kind?:string}): void
	{
		this.currentItemCount = data.currentItemCount;
		this.itemsPerPage = data.itemsPerPage;
		this.startIndex = data.startIndex;
		this.totalItems = data.totalItems;
		this.pageIndex = data.pageIndex;
		this.totalPages = data.totalPages;
		this.kind = data.kind;
	}

	public getForCopy(): {currentItemCount:number,
		itemsPerPage?:number,
		startIndex?:number,
		totalItems?:number,
		pageIndex?:number,
		totalPages?:number,
		kind?:string}
	{
		return {currentItemCount:this.currentItemCount,
			itemsPerPage:this.itemsPerPage,
			startIndex:this.startIndex,
			totalItems:this.totalItems,
			pageIndex:this.pageIndex,
			totalPages:this.totalPages,
			kind:this.kind};
	}

} 	