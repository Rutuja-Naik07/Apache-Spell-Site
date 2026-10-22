const L=[
["Rent the shop building","AWS Cloud and EC2","Ravi rents a tower on the castle grounds. Nobody lives there yet.","Launch an EC2 instance (Amazon Linux 2023) inside a VPC public subnet. AWS gives you the server, you set it up.","The castle grounds, the private neighbourhood and an empty tower appear.","# in the AWS console\nLaunch instance → t2.micro → key pair"],
["Walk in with the key","Connect to EC2 over SSH","Ravi uses a magic key that only he owns to enter the tower from his laptop.","You connect with SSH on port 22 using your private key pair (or EC2 Instance Connect).","A golden key travels the dashed line from Ravi's laptop to the tower.","ssh -i my-key.pem ec2-user@PUBLIC-IP"],
["Hire the receptionist","Install Apache HTTPD","Ravi hires a receptionist who greets every visitor who knocks.","Apache HTTP Server is installed with the package manager. It listens for web requests.","The receptionist box appears inside the tower, still unpacking.","sudo dnf install httpd -y"],
["Switch the receptionist on","Start and enable Apache","The receptionist sits at the door and will return every time the tower reboots.","systemctl starts httpd now and enables it at boot. It listens on port 80.","A green light shows Apache is running.","sudo systemctl start httpd\nsudo systemctl enable httpd"],
["Put the welcome page on the shelf","Create index.html in /var/www/html","Ravi leaves a welcome scroll on the shelf. This is what visitors will read.","Apache serves files from its document root, /var/www/html. index.html is the default page.","A scroll named index.html lands on the shelf.","echo '<h1>Welcome to Ravi Shop</h1>' | sudo tee /var/www/html/index.html"],
["Set the door guard","Configure the Security Group","A guard stands at the gate. Anyone may enter the shop door (80), but only Ravi may use the secret door (22).","A security group is a stateful virtual firewall. Add inbound rules for HTTP 80 from anywhere and SSH 22 from your IP.","A red ring wraps the tower. Watch the intruder bounce off it.","HTTP  TCP 80  0.0.0.0/0\nSSH   TCP 22  MY-IP/32"],
["A visitor knocks","Public IP and browser","A visitor types the shop's address into their owl-post browser and sends a letter.","The browser sends an HTTP request to the instance's public IP, through the internet gateway.","A letter flies in through the gateway to the receptionist.","http://PUBLIC-IP"],
["The receptionist hands over the page","Apache serves the website","The receptionist fetches the welcome scroll and carries it back to the visitor.","Apache maps the request to /var/www/html/index.html and returns HTTP 200 with the HTML.","A scroll flies back to the visitor.","curl -I http://localhost\n# HTTP/1.1 200 OK"],
["Keep an eye on the shop","Monitoring and troubleshooting","A watchful eye checks the registers and the door log. If something breaks, Ravi knows where to look.","Check systemctl status, the Apache logs in /var/log/httpd and security group rules. CloudWatch adds metrics.","The monitor appears beside the tower.","sudo systemctl status httpd\nsudo tail /var/log/httpd/error_log"],
["The whole castle, working","Complete architecture","Visitors reach the shop through the gate, the guard checks them, and the receptionist serves the page.","Internet → Internet Gateway → Security Group → EC2 → Apache → index.html.","Everything is live. Press Play to see the whole journey.","# done 🎉"]];
const F=[{p:"f1",e:"🗝️",a:2,z:5},{p:"f2",e:"✉️",a:7,z:10},{p:"f3",e:"📜",a:8,z:10},{p:"f4",e:"😈",a:6,z:10,b:1}];
const $=id=>document.getElementById(id),NS="http://www.w3.org/2000/svg";let cur=0,timer=null;
const nav=$("list");L.forEach((s,i)=>{const b=document.createElement("button");b.innerHTML=(i+1)+". "+s[0]+"<small>"+s[1]+"</small>";b.onclick=()=>{stop();go(i+1)};nav.append(b)});
const fl=F.map(f=>{const t=document.createElementNS(NS,"text");t.setAttribute("font-size","22");t.setAttribute("text-anchor","middle");t.textContent=f.e;t.style.opacity=0;$("dots").append(t);return{...f,t,el:$(f.p)}});
function go(n){cur=n;document.querySelectorAll(".a").forEach(e=>e.classList.toggle("show",+e.dataset.s<=n));
[...nav.children].forEach((b,i)=>{b.setAttribute("aria-current",i+1===n);b.classList.toggle("done",i+1<n)});
const s=n?L[n-1]:["Press Next to begin","—","Each lesson adds one piece to the castle.","","# waiting…"];
$("plain").textContent=s[2]||s[0];$("tech").textContent=s[3]||s[1];$("watch").textContent=s[4]||"";$("cmd").textContent=s[5]||"";
const c=(s[5]||"").split("\n");$("cmd1").textContent=n>=2?"$ "+(c[0]||""):"";$("cmd2").textContent=n>=2&&c[1]?"$ "+c[1]:"";
$("ast").textContent=n>=4?"● running · port 80":"installing…";
if(n){$("plain").previousElementSibling.textContent="In plain words"}}
function stop(){clearInterval(timer);timer=null;$("play").textContent="▶ Play"}
$("prev").onclick=()=>{stop();go(Math.max(0,cur-1))};$("next").onclick=()=>{stop();go(Math.min(10,cur+1))};
$("reset").onclick=()=>{stop();go(0)};
$("play").onclick=()=>{if(timer)return stop();$("play").textContent="⏸ Pause";if(cur>=10)go(0);go(cur+1);timer=setInterval(()=>{if(cur>=10)return stop();go(cur+1)},5000)};
$("theme").onclick=()=>{const h=document.documentElement;h.dataset.theme=h.dataset.theme==="night"?"light":"night"};
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function tick(ms){fl.forEach(f=>{if(rm||cur<f.a||cur>f.z){f.t.style.opacity=0;return}
const len=f.el.getTotalLength();let u=(ms/3400+f.a*.17)%1;if(f.b){u=u<.5?u*2:2-u*2}
const p=f.el.getPointAtLength(u*len);f.t.setAttribute("x",p.x);f.t.setAttribute("y",p.y+8);f.t.style.opacity=1});requestAnimationFrame(tick)}
requestAnimationFrame(tick);go(0);
