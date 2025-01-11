---

---

<div style="display: inline-block; list-style: none; margin-left: auto; margin-right: auto; max-width: 1200px; flex-grow: 1; text-align: center; align-items: center " class="main">
	<div class="adventure">
        <img class="aerial_soundwaves" src="/images/Aerial_Soundwaves_winter.png" >
        <img class="bit_rate" src="/images/BitRate_winter.png" >
        <img class="neural_net" src="/images/NeuralNet_winter.png" >
    </div>
	<div class="text-box" >
        <h1 style="font-size: 2.8em; margin: 0">PonyFest Online x PVFM 14th Birthday</h1>
        <p style="font-size: 2em; margin: 0">Saturday, January 25th 2025</p>
        <p style="font-size: 2em; margin: 0">Sunday, January 26th 2025</p>
        <!--<p style="font-size: 2em; margin: 0">10:00PM EDT</p>-->
        <br>
        <!-- <div class="discord-box"> -->
        <div>
            <p style="font-weight: bold;">Pick up your badge here!</p>
            <p><a href="https://discord.gg/nSDGJCg" class="discord" style="height: 100px; width: 300px;"></a><br>
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
