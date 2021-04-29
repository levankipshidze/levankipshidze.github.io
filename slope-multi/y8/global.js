function showNextAd()
{
	try {
        console.log('Showing Ads')
        playAds()
    }
    catch (e) {
        console.log(e + ' Error Showing Ads')
        showMessage()
    }
}

function getVal()
{
	//console.log('getVal')
	return isAdCompleted;
}

function showMessage()
{
	isAdCompleted = 3;
}

function showCustomLeaderboard()
{
	console.log("showCustomLeaderboard");
	closeMenu();
	ID.GameAPI.Leaderboards.list({table:'Leaderboard',  embedded: 'true'});
	
}

function closeMenu()
{
	console.log("closeMenu");
	ID.closeMenu();
}