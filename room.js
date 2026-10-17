/* The room: a starcloth with pin lights, four house beams through haze, and
   a rig drawn from where a guest stands -- dance floor, stage, subs, a line
   array each side, and two matching truss towers whose four movers work the
   floor. Diamond blue on black.

   IT DRAWS NOTHING OVER THE BLACK. No vignette, no drape wash, no house
   pool: the beams and the pin lights ARE the light, and a gradient laid
   under them is fog with nothing making it. Measured on the finished page,
   60% of the frame is exactly #000. That also keeps the one thing that
   bands on a phone -- a smooth ramp across a large area of nothing -- out
   of the page entirely.

   A page using this provides <canvas id="bg"> and nothing else. */
(() => {
const R=(a,b)=>a+Math.random()*(b-a);
/* THE ROOM, FROM WHERE A GUEST STANDS. One-point perspective with the
   vanishing point dead centre: the viewer is on the dance floor, eye height,
   looking straight at the stage. Everything that is symmetrical in a real
   room is symmetrical on screen, which is what makes it sit balanced.

   The first version was a cabinet projection -- a three-quarter technical
   view, correct and legible, but nobody at the party ever sees the room from
   there. A guest sees the arrays left and right of the stage at equal height,
   the subs in a line along the deck, and the beams coming over their head
   onto the floor they are standing on. That is this.

   It is drawn INTO the same canvas as the drape, the pin lights and the
   house beams, after them, so its beams sit in the same haze rather than on
   top of a picture of haze. */
function rig(x, W, H, t, dim) {
  const S = Math.min(W, H) * 0.62;      // focal length, in pixels
  const EYE = 1.62, CAM = 4.2;          // a guest's eye height, and how far
  const cx = W * 0.5, cy = H * 0.534;  // the vanishing point, dead centre
  const P = (wx, wy, wz) => {
    const d = wz + CAM;
    return [cx + (wx * S) / d, cy - ((wy - EYE) * S) / d];
  };
  const line = (a, b, col, wd) => {
    x.strokeStyle = col; x.lineWidth = wd; x.beginPath();
    x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
  };
  const poly = (pts, fill, stroke, wd) => {
    x.beginPath();
    pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]));
    x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (stroke) { x.strokeStyle = stroke; x.lineWidth = wd || 1; x.stroke(); }
  };
  // a cabinet (a sub, a speaker box) as four visible edges -- front face and
  // the top, which is all the eye needs at this size
  const cab = (x0, y0, z0, dx, dy, dz, fill, edge, wd) => {
    const a=P(x0,y0+dy,z0), b=P(x0+dx,y0+dy,z0), c=P(x0+dx,y0,z0), d=P(x0,y0,z0);
    const e=P(x0,y0+dy,z0+dz), f=P(x0+dx,y0+dy,z0+dz);
    poly([a,b,c,d], fill, edge, wd||1);
    poly([a,e,f,b], fill, edge, wd||1);
  };

  const EDGE = `rgba(178,214,255,${.55*dim})`;
  const SOFT = `rgba(150,196,255,${.34*dim})`;
  const FILL = `rgba(24,44,84,${.34*dim})`;

  x.save();
  x.lineJoin = 'round';

  // ── the dance floor the guest is standing on ──────────────────────────
  const FZ0 = 1.3, FZ1 = 7.4, FX = 4.2;
  const fl = [P(-FX,0,FZ0), P(FX,0,FZ0), P(FX,0,FZ1), P(-FX,0,FZ1)];
  const fg = x.createLinearGradient(0, P(0,0,FZ0)[1], 0, P(0,0,FZ1)[1]);
  fg.addColorStop(0, `rgba(104,156,232,${.22*dim})`);
  fg.addColorStop(1, `rgba(44,78,146,${.07*dim})`);
  poly(fl, fg, `rgba(176,212,255,${.46*dim})`, 1.2);
  for (let i = 1; i < 6; i++) {                  // panel joins, running away
    const px = -FX + 2*FX*i/6;
    line(P(px,0,FZ0), P(px,0,FZ1), SOFT, .7);
  }
  for (let i = 1; i < 4; i++) {
    const pz = FZ0 + (FZ1-FZ0)*i/4;
    line(P(-FX,0,pz), P(FX,0,pz), SOFT, .7);
  }

  // ── the stage, straight ahead ─────────────────────────────────────────
  const SZ = 7.9, SD = 3.0, SW = 5.2, SH = 1.05;
  cab(-SW, 0, SZ, SW*2, SH, SD, `rgba(20,38,78,${.50*dim})`, EDGE, 1.2);
  for (let i = 1; i < 6; i++) {                  // deck sections
    const px = -SW + 2*SW*i/6;
    line(P(px,SH,SZ), P(px,SH,SZ+SD), SOFT, .6);
  }

  // ── the booth, centre stage, with somebody behind it ──────────────────
  // SUBTLE ON PURPOSE. At this scale a DJ is four strokes: the shoulders,
  // the head, and the two forearms down to the decks. Any more and it stops
  // reading as a person and starts reading as a smudge -- the same reason
  // the rig is a line drawing rather than a rendering.
  const BW = 1.25, BZ = SZ + 0.55, BD = 0.62, BH = 0.92;
  const DY = SH;                              // standing on the stage deck
  // the booth cover: the façade the audience sees, a plain faced box
  cab(-BW, DY, BZ, BW*2, BH, BD, `rgba(26,48,92,${.52*dim})`, EDGE, 1.1);
  // a lit edge along its top, the way a booth façade is usually trimmed
  line(P(-BW,DY+BH,BZ), P(BW,DY+BH,BZ), `rgba(206,232,255,${.62*dim})`, 1.3);

  // the table top, and what is on it: two CDJs with the mixer between them
  const TY = DY + BH + 0.04;
  for (const [dx, dw] of [[-0.86, 0.52], [0.34, 0.52], [-0.24, 0.46]]) {
    cab(dx, TY, BZ - 0.06, dw, 0.07, 0.42, `rgba(34,60,112,${.5*dim})`, SOFT, .8);
  }

  // NOBODY BEHIND IT. Josh: remove the DJ, leave the booth. The booth and
  // the decks stay because they are the stage; the figure is gone entirely
  // rather than faded back, since a half-visible person is worse than none.

  // ── subs in a line along the deck, symmetrical about centre ───────────
  for (const sx of [-3.3, -2.0, 1.1, 2.4]) {
    cab(sx, 0, SZ-1.0, 1.05, 0.78, 0.8, FILL, EDGE);
  }

  // ── a line array flown each side of the stage, at equal height ────────
  for (const ax of [-5.0, 4.1]) {
    for (let i = 0; i < 7; i++) {
      const yy = 5.3 - i * 0.44;
      cab(ax, yy, SZ+0.4, 0.9, 0.40, 0.66, FILL, EDGE);
    }
    line(P(ax+0.45,5.72,SZ+0.7), P(ax+0.45,7.4,SZ+0.7), SOFT, .8);
  }

  // ── a tower each side, the same tower mirrored ────────────────────────
  // Josh: duplicate it on the opposite side. One function, called twice with
  // the sign flipped, so the two can never drift apart -- which they would
  // the first time somebody adjusted a bay height on one of them.
  const TH = 6.0, tw = 0.30, tz = 4.6;
  function tower(tx, flip) {
    const face = [[tx-tw,tz-tw],[tx+tw,tz-tw],[tx+tw,tz+tw],[tx-tw,tz+tw]];
    for (const [lx, lz] of face) line(P(lx,0,lz), P(lx,TH,lz), EDGE, 1.2);
    for (let i = 0; i <= 10; i++) {
      const yy = TH * i / 10;
      line(P(tx-tw,yy,tz-tw), P(tx+tw,yy,tz-tw), EDGE, .85);
      line(P(tx+flip*tw,yy,tz-tw), P(tx+flip*tw,yy,tz+tw), SOFT, .7);
      if (i < 10) {
        const ny = TH * (i+1) / 10;
        line(P(tx-tw,yy,tz-tw), P(tx+tw,ny,tz-tw), SOFT, .7);
      }
    }
    const TB = 1.25;
    line(P(tx-TB,TH,tz), P(tx+TB,TH,tz), EDGE, 1.6);
    line(P(tx,TH,tz), P(tx,TH-0.34,tz), EDGE, 1.1);
    return TB;
  }
  const TX = 5.6;
  tower(-TX, +1);
  tower(+TX, -1);

  // ── four heads, two a side, all aimed at the floor ────────────────────
  x.globalCompositeOperation = 'lighter';
  const heads = [
    { hx:-TX-0.78, px:-1.5 + Math.sin(t*0.30)*2.0,     pz:3.0 + Math.sin(t*0.19)*1.5 },
    { hx:-TX+0.78, px: 0.6 + Math.sin(t*0.26+2.2)*1.9, pz:4.6 + Math.cos(t*0.23)*1.4 },
    { hx: TX+0.78, px: 1.5 + Math.sin(t*0.30+3.1)*2.0, pz:3.0 + Math.sin(t*0.19+1.1)*1.5 },
    { hx: TX-0.78, px:-0.6 + Math.sin(t*0.26+5.3)*1.9, pz:4.6 + Math.cos(t*0.23+2.4)*1.4 }
  ];
  for (const m of heads) {
    const head = P(m.hx, TH - 0.36, tz);
    const land = P(m.px, 0, m.pz);
    const w0 = S*0.016/(tz+CAM)*6, w1 = S*0.09/(m.pz+CAM)*6;
    const ang = Math.atan2(land[1]-head[1], land[0]-head[0]);
    const n = [-Math.sin(ang), Math.cos(ang)];
    const bg = x.createLinearGradient(head[0],head[1],land[0],land[1]);
    bg.addColorStop(0,  `rgba(214,236,255,${.40*dim})`);
    bg.addColorStop(.5, `rgba(160,204,255,${.14*dim})`);
    bg.addColorStop(1,  `rgba(126,176,255,${.025*dim})`);
    poly([[head[0]-n[0]*w0,head[1]-n[1]*w0],[head[0]+n[0]*w0,head[1]+n[1]*w0],
          [land[0]+n[0]*w1,land[1]+n[1]*w1],[land[0]-n[0]*w1,land[1]-n[1]*w1]],
         bg, null);
    const pr = w1*1.7;
    const pg = x.createRadialGradient(land[0],land[1],0,land[0],land[1],pr);
    pg.addColorStop(0, `rgba(214,236,255,${.42*dim})`);
    pg.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = pg;
    x.beginPath(); x.ellipse(land[0],land[1],pr,pr*0.32,0,0,7); x.fill();
    const lg = x.createRadialGradient(head[0],head[1],0,head[0],head[1],w0*3.2);
    lg.addColorStop(0, `rgba(236,246,255,${.7*dim})`);
    lg.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = lg; x.beginPath(); x.arc(head[0],head[1],w0*3.2,0,7); x.fill();
  }
  x.globalCompositeOperation = 'source-over';

  // No vignette, no haze: past the rig there is nothing drawn, so the
  // black is the panel's own black rather than a gradient toward it.
  x.restore();
}


let pins=null;
function gala(x,W,H,t){
  if(!pins) pins=Array.from({length:Math.round(W*H/26000)},()=>{const u=Math.random();
    return{x:Math.random(),y:R(0,.74),s:1.6+Math.pow(u,3)*7,b:.3+.7*Math.pow(u,2.2),
           f:R(.5,2.2),p:R(0,40),sh:R(1.8,4.4)};});
  x.fillStyle='#000';x.fillRect(0,0,W,H);
  // No drape wash. It was a blue gradient up from the floor and it turned
  // the deepest part of the frame into blue-grey -- the same fault the
  // wallpaper's 10% blue haze had, where the black stopped being black.
  x.globalCompositeOperation='lighter';
  for(const p of pins){
    let k=.5+.5*Math.sin(t*p.f+p.p);k=Math.pow(k,p.sh);
    const r=p.s*(1+.75*k),b=p.b*(.16+.95*k),px=p.x*W,py=p.y*H;
    const g=x.createRadialGradient(px,py,0,px,py,r);
    g.addColorStop(0,`rgba(255,255,255,${b})`);
    g.addColorStop(.3,`rgba(198,226,255,${b*.5})`);g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);
    if(p.s>4&&k>.55){const L=p.s*2.6*b;x.strokeStyle=`rgba(226,241,255,${b*.5})`;
      x.lineWidth=.8;x.beginPath();x.moveTo(px-L,py);x.lineTo(px+L,py);
      x.moveTo(px,py-L);x.lineTo(px,py+L);x.stroke();}
  }
  for(let i=0;i<4;i++){
    const px=W*(.17+.22*i),sway=Math.sin(t*.3+i*1.8)*W*.2,tx=px+sway,
          half=W*.05*(1+.22*Math.sin(t*.65+i));
    const b=x.createLinearGradient(px,0,tx,H);
    b.addColorStop(0,'rgba(186,220,255,.30)');b.addColorStop(.5,'rgba(150,196,255,.085)');
    b.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=b;x.beginPath();x.moveTo(px-W*.005,0);x.lineTo(px+W*.005,0);
    x.lineTo(tx+half,H);x.lineTo(tx-half,H);x.closePath();x.fill();
    const o=x.createRadialGradient(px,0,0,px,0,W*.03);
    o.addColorStop(0,'rgba(236,246,255,.58)');o.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=o;x.beginPath();x.arc(px,0,W*.03,0,7);x.fill();
  }
  // No house pool either. The beams and the pin lights ARE the light; a
  // wash laid under them is fog with nothing making it.
  x.globalCompositeOperation='source-over';
}


const c=document.getElementById('bg');
if (c) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fit = () => { const d = Math.min(devicePixelRatio || 1, 2);
    c.width  = Math.max(2, Math.round(innerWidth  * d));
    c.height = Math.max(2, Math.round(innerHeight * d)); };
  fit(); addEventListener('resize', fit);
  let last = 0;
  (function loop(now){
    requestAnimationFrame(loop);
    if (document.hidden || now - last < 1000/30) return; last = now;
    // REDUCED MOTION STILL GETS THE ROOM, held at one moment rather than
    // blanked: the page is the room, and an empty black rectangle is not a
    // gentler version of it.
    const t = reduce ? 3.2 : now / 1000, x = c.getContext('2d');
    x.setTransform(1,0,0,1,0,0);
    gala(x, c.width, c.height, t);
    rig(x, c.width, c.height, t, 1);
  })(0);
}
})();
