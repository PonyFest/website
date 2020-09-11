---

---
<style type="text/css">
.discord-box {
	margin-left: auto;
	margin-right: auto;
	width: 480px;
	max-width: 90vw;
	border: 1px solid #aebbea;
	background-color: #104466;
	border-radius: 5px;
	padding: 10px;
	text-align: center;
}

p {
	font-size: 1.3em;
}

.vendors h2 {
	margin-top: 0;
}

.vendors p:last-child {
	margin-bottom: 0;
}

.content > div {
	display: flex;
}
</style>
<div style="display: flex; flex-wrap: wrap; margin-left: auto; margin-right: auto; max-width: 1200px; flex-grow: 1; align-items: center" class="main">
	<div style="text-align: center; flex-grow: 1;"><img id="bitrate" src="/images/mascot.png"></div>
	<div class="text-box" style="display: flex; flex-direction: column; justify-content: space-around; text-align: center; flex-grow: 1; width: 500px;">
		<div>
			<h1 style="font-size: 3em; margin: 0">PonyFest Online! 4.0</h1>
			<p style="font-size: 2.5em; margin: 0">Saturday, September 19th, 2020</p>
		</div>
		<div>
			<p>We're back! Get together in cyberspace for PonyFest Online, a Discord-based online pony convention!</p>
			<p>Featuring panels, vendors, gaming, ponies, and hanging out.</p>
			<p>You can also now <a href="https://store.ponyfest.horse/">buy autographs and zoom calls</a> with some of our VIPs!</p>
		</div>
		<!-- <div class="discord-box"> -->
		<div>
            <p style="font-weight: bold;">Pick up your badge here!</p>
			<p><a href="https://discord.gg/ponyfest" class="discord" style="height: 100px; width: 300px;"></a><br>
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
