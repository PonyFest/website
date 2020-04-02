---

---
<style type="text/css">
.discord-box {
	margin-top: 20px;
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
	<div style="display: flex; flex-direction: column; justify-content: space-around; text-align: center; flex-grow: 1; width: 500px;">
		<div>
			<h1 style="font-size: 3em; margin: 0;">PonyFest Online! Will Return</h1>
			<p style="font-size: 2.5em; margin: 0;">Saturday, April 25th, 2020</p>
		</div>
		<div class="discord-box">
			<p>Have an idea for a panel?<br><strong><a href="https://forms.gle/Zx1BjChWe27xzH1b8">Panel applications are now open</a></strong>!<br>Please submit your panels by Friday, April 10th.</p>
			<p>Additionally, <strong><a href="https://forms.gle/ondsJzFpKLHp5x8bA">Vendor applications are also open</a></strong>.</p>
		</div>
		<div>
			<p>Thank you so much! Whether you were a panelist, vendor, staff, or one of our 4,000 "attendees", we couldn't have done this without you. Thanks to you all, PonyFest Online! was more successful than we ever imagined. So successful, in fact, that we're going to do it again! Join us on Saturday, April 25th for PonyFest Online! 2.0.</p>
			<p><a href="https://forms.gle/Zx1BjChWe27xzH1b8">Panel</a> and <a href="https://forms.gle/ondsJzFpKLHp5x8bA">vendor</a> applications are now open.<br>We also have a <a href="https://docs.google.com/forms/d/e/1FAIpQLSeYpgn0hZaLvISMZuizri-MKJ9xSVQX-wGy6BJlaOm_afSMLg/viewform">survey for you to fill in</a>.</p>
			<p>For now, you can still hang out with us in the hotel lobby <a href="https://discord.gg/nSDGJCg">on Discord</a>.</p>
		</div>
		<div>
			<img src="/images/bitrate-thanks.jpg">
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
