<?php defined('AUTOMAD') or die('Direct access not permitted!'); ?>
<@ snippets/header.php @>

	<ul class="uk-grid uk-grid-width-medium-1-2">
		<li class="uk-block">
			<h1 class="uk-margin-small-bottom">@{ title }</h1>
			<@ ../snippets/date.php @>
			<@ ../snippets/tags.php @>
		</li>
		<@ if @{ textTeaser } @>
			<li class="content uk-block">
				@{ textTeaser | markdown }
			</li>	
		<@ end @>
	</ul>
	<@ filelist { 
		glob: @{ imagesSlideshow | def('*.jpg, *.jpeg, *.png, *.gif') }, 
		sort: 'asc' 
	} @>
	<@ if @{ :filelistCount } @>
		<div class="uk-block">
			<div class="uk-panel uk-panel-box">	
				<div class="uk-panel-teaser">	
					<@ ../snippets/slideshow.php @>
				</div>
			</div>
		</div>
	<@ end @>
	<div class="content uk-block uk-column-large-1-2">
		@{ text | markdown }
	</div>
	<# Related pages. #>
	<@ newPagelist { type: 'related' } @>
	<@ if @{ :pagelistCount } @>
		<div class="uk-block">
			<h2>@{ labelRelated | def ('Related') }</h2>
			<@ snippets/pagelist_blog.php @>
		</div>
	<@ end @>
	<div class="uk-block uk-margin-top">
		<@ ../snippets/prev_next.php @>
	</div>
	
<@ snippets/footer.php @>