---

---
<style type="text/css">
.discord-box {
	margin-left: auto;
	margin-right: auto;
	width: 480px;
	max-width: 90vw;
	border: 1px solid #aebbea;
	background-color: #dbe1f5;
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
</style>
<div style="display: flex; flex-wrap: wrap;">
	<div style="text-align: center; flex-grow: 1;"><img style="padding-right: 20px;" src="/images/mascot.png"></div>
	<div style="display: flex; flex-direction: column; justify-content: space-around; text-align: center; flex-grow: 1; width: 500px;">
		<div>
			<h1 style="font-size: 3em; margin: 0;">PonyFest Online!</h1>
			<p style="font-size: 2.5em; margin: 0;">Saturday March 28th, 2020</p>
		</div>
		<div>
			<p>Get together online for PonyFest Online, a Discord-based online pony convention <strong>this Saturday</strong>!</p>
			<p>Featuring panels, vendors, gaming, ponies, and plenty of hanging out.</p>
		</div>
		<div class="discord-box">
			<p style="font-weight: bold;">Pick up your badge here!</p>
			<p><a href="https://discord.gg/nSDGJCg" class="discord" style="height: 100px; width: 300px;"></a><br><span id="onlineSpan" style="font-weight: normal;"></span></p>
		</div>
	</div>
</div>

<script type="text/javascript">
var onlineSpan = document.getElementById('onlineSpan');
if (window.fetch) {
	async function update() {
		let result = await fetch("https://discordapp.com/api/guilds/690991376514547754/widget.json");
		let json = await result.json()
		let online = json['presence_count'];
		if (online) {
			onlineSpan.innerHTML =  ""+online + ' online now!';
		}
	}
	update();
	setTimeout(update, 300000);
}
</script>
