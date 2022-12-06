// CLASSE PRINCIPALE
export class Scene {
    constructor(canvas, ctx, bgFolder, bgFramesNb, detailAnime) {
        this.cnv = canvas;
        this.bgFolder = bgFolder;
        this.bgLayers = [];
        this.ctx = ctx;
        this.nbBgFrames = bgFramesNb;
        this.img;
        this.imgId = 0;
        this.animeDetail = detailAnime;
        this.timeAnimation = 0;
        this.proceduralTab = [];
        this.platformW = 128 / 2;
        this.platformH = 120 / 8;
        this.cnvW = 128/2;
        this.cnvH = 120;
        this.spriteWidth;
        this.spriteHeight;
        this.platforms = [];
    }

    /* Chargement du Background */
    loadBg() {
        for (let i = 0; i < this.nbBgFrames; i++) {
            this.img = new Image();
            this.img.src = `assets/img/bg/${this.bgFolder}/frame_${i.toString().padStart(2, '0')}.png`;
            this.bgLayers.push(this.img);
        }
    }

    /* Initialisation element décor */
    init() {
        this.loadBg();
        this.procedural();

        for (let point of this.proceduralTab) {

            this.platforms.push(
                new SAT.Box(
                    new SAT.Vector(
                        this.platformW * point.randJ,
                        this.cnvH * point.randI + (this.cnvH - this.cnvH / 16)),
                    this.platformW,
                    this.platformH).toPolygon());
        }
        
        // SOL
        this.platforms.push(
            new SAT.Box(new SAT.Vector(- 50, this.cnv.height - 5), this.cnv.width + 100, this.platformH).toPolygon());

        //console.table(this.platforms[1]);

    }

    /* Dessing Background */
    drawBg(camera) {
        const ratioW = this.cnv.width / this.bgLayers[this.imgId].width;
        const ratioH = this.cnv.height / this.bgLayers[this.imgId].height;
        const ratio = Math.max(ratioW, ratioH);
        const w = this.bgLayers[this.imgId].width * ratio;
        const h = this.bgLayers[this.imgId].height * ratio;
        //const h = (this.bgLayers[this.imgId].height / this.bgLayers[this.imgId].width) * this.cnv.width;
        //const w = this.cnv.width;
        //console.log(h, w);
        this.ctx.save();
        /**
         * Translate la position du contexte et décale l'origine du canvas 0,0
         * @param x : décalage horizontale
         * @param y : décalage verticale
         */
        this.ctx.translate(this.cnv.width / 2, this.cnv.height / 2);
        /**
         * Dessine l'image dans le contexte 2D
         * @param Image     : Image à dessiner
         * @param dX        : coord x position de l'image dans le canvas
         * @param dY        : coord y position de l'image dans le canvas
         * @param dWidth    : Largeur de l'image
         * @param dHeight   : Hauteur de l'image
         * @param sx        :  
         * @param sy        : 
         * @param sLargeur  : 
         * @param sHauteur  : 
         */
        this.ctx.drawImage(this.bgLayers[this.imgId], 0, 0, this.bgLayers[this.imgId].width, this.bgLayers[this.imgId].height, -w / 2, -h / 2, w, h);
        //this.ctx.drawImage(this.bgLayers[this.imgId], 0, 0, this.bgLayers[this.imgId].width, this.bgLayers[this.imgId].height, Math.floor(16 - (camera.position.x / 2)), -camera.position.y, w, h);
        this.ctx.restore();
    }

    /* Animation du Background */
    animeBg(time) {
        if (time.previous > this.timeAnimation + 99) {
            this.timeAnimation = time.previous;
            this.imgId++;
            if (this.imgId > this.animeDetail.animations[0].end)
                this.imgId = this.animeDetail.animations[0].start;
        }
    }

    /* Procedural Platform */
    procedural() {
        for (let i = 0; i < 16; i++) {
            let randJ = Math.floor(Math.random() * 10);
            let randI = Math.floor(Math.random() * 3);
            this.proceduralTab.push({ randI, randJ });
        }
    }


    drawPlf() {
        /**
         * Que des plateformes au niveau 0 
         * Que des plateformes accéssibles sur la meme colone d'une ligne maximum d'écart
         * 1er tour : Full plateforme au niveau 0 
         * 2eme tour : plateforme niv 1 
         * 3 eme tour / 4eme tour  : s'assurer au niv 2 que les plateformes sont accessibles
         * 5 eme tour : Placer des objets ( 2eme grille objet)   
         *  */
        this.ctx.fillStyle = "darkgrey";
        for (let platform of this.platforms) {
            const box = platform.getAABBAsBox();
            this.ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h);
            this.ctx.strokeRect(box.pos.x, box.pos.y, box.w, box.h);
            
        }

    }

}
