<?php 
/*
 *	                  ....
 *	                .:   '':.
 *	                ::::     ':..
 *	                ::.         ''..
 *	     .:'.. ..':.:::'    . :.   '':.
 *	    :.   ''     ''     '. ::::.. ..:
 *	    ::::.        ..':.. .''':::::  .
 *	    :::::::..    '..::::  :. ::::  :
 *	    ::'':::::::.    ':::.'':.::::  :
 *	    :..   ''::::::....':     ''::  :
 *	    :::::.    ':::::   :     .. '' .
 *	 .''::::::::... ':::.''   ..''  :.''''.
 *	 :..:::'':::::  :::::...:''        :..:
 *	 ::::::. '::::  ::::::::  ..::        .
 *	 ::::::::.::::  ::::::::  :'':.::   .''
 *	 ::: '::::::::.' '':::::  :.' '':  :
 *	 :::   :::::::::..' ::::  ::...'   .
 *	 :::  .::::::::::   ::::  ::::  .:'
 *	  '::'  '':::::::   ::::  : ::  :
 *	            '::::   ::::  :''  .:
 *	             ::::   ::::    ..''
 *	             :::: ..:::: .:''
 *	               ''''  '''''
 *	
 *
 *	AUTOMAD
 *
 *	Copyright (c) 2014 by Marc Anton Dahmen
 *	http://marcdahmen.de
 *
 *	Licensed under the MIT license.
 *	http://automad.org/license
 */


namespace Automad\GUI;
use Automad\Core as Core;


defined('AUTOMAD') or die('Direct access not permitted!');


if (isset($this->Automad)) {
	$sitename = $this->Automad->Shared->get(AM_KEY_SITENAME);
} else {
	// Create Shared object in case no user is logged in and the Automad object didn't get created.
	$Shared = new Core\Shared();
	$sitename = $Shared->get(AM_KEY_SITENAME);
}


?>

	<nav class="navbar navbar-default navbar-fixed-top hidden-sm hidden-xs" role="navigation">
		<div class="container">
			<div class="inner clearfix">
				<div class="navbar-left">
					<div class="logo"><a href="<?php echo AM_BASE_URL . AM_INDEX . AM_PAGE_GUI; ?>"><span class="glyphicon automad"></span></a></div>
				</div>
				<ul class="nav navbar-nav navbar-right">
					<li>
						<a href="<?php echo AM_BASE_URL; ?>/" target="_blank">
							<span class="glyphicon glyphicon-home"></span><span class="hidden-md"> <?php echo $sitename; ?></span>
						</a>
					</li>
					<li>
						<a href="http://automad.org" target="_blank">
							<span class="glyphicon glyphicon-question-sign"></span><span class="hidden-md"> <?php echo Text::get('btn_docs'); ?></span>
						</a>
					</li>
					<?php if (User::get()) { ?><li>
						<a href="?context=logout">
							<span class="glyphicon glyphicon-off"></span> <?php echo Text::get('log_out_title'); ?> "<?php echo ucwords(User::get()); ?>"
						</a>
					</li><?php } ?> 
				</ul>
			</div>
    		</div>
	</nav>
	