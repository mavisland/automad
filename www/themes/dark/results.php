i(elements/header.php)

	<div class="top">

		t(navTop {homepage: true})
		t(search)
		
		t(listSetup {
			vars: "title, subtitle", 
			glob: "*.jpg", 
			width: 250, 
			height: 150, 
			crop: 1
		})
		
		<h3 class="results">p(title) (t(listCount))</h3>
		
		t(listFilters)
		
		t(listSortItems {
			title: "By Name", 
			subtitle: "By Subtitle", 
			tags: "By Tags"
		})
		
		t(listSortOrder)
	
	</div>
	
	t(listPages)
	
i(elements/footer.php)