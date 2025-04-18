---

---

<div class="front-page-container">
	<div class="front-image" style="display: inline-block;">
        <img src="/images/PinkaboosNeighhem.png" style="max-width: 900px">
    </div>
	<div>
        <h1 style="font-size: 2.8em; margin: 0">PonyFest Presents <br> PINKABOO's <br> NEIGHHEM</h1>
        <p style="font-size: 2em; margin: 0">Sunday</p>
        <p style="font-size: 2em; margin: 0">April 20th, 2025</p>
        <!-- <div class="discord-box"> -->
        <div>
            <p style="font-weight: bold;">Pick up your badge here!</p>
            <p><a href="https://discord.gg/nSDGJCg" class="discord"></a><br>
            <span id="onlineSpan" style="font-weight: normal;"></span></p>
        </div>
    </div>
</div>


<script type="text/javascript">
var onlineSpan = document.getElementById('onlineSpan');
if (window.fetch) {
	async function update() {
		let result = await fetch("https://discordapp.com/api/guilds/690991376514547754/widget.json");
		let json = await result.json();
		let online = json['presence_count'];
		if (online) {
			if (online.toLocaleString) {
				online = online.toLocaleString();
			} else {
				online = online.toString();
			}
			onlineSpan.innerHTML =  online + ' online now!';
		}
	}
	update();
	setTimeout(update, 300000);
}
</script>
