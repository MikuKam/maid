//=============================================================================

// Skittle.js

//=============================================================================



/*:ja

 * v0.1.0

 * @plugindesc

 * ����Q�[�W�̃��[�^�[�𑝌�����

 *

 * @author �I�I�z�^���T�C�R

 * 

 * @param Container

 * @default

 * @desc �e��(img/system)

 * 

 * @param Content

 * @default

 * @desc �e��(img/system)

 * 

 * @param Capacity

 * @default 100

 * @desc �ő�l

 * 

 * @param Default

 * @default 100

 * @desc �J�n�l

 * 

 * @param Variable

 * @default 1

 * @desc �e�ʒl�i�[��ϐ��ԍ�

 * 

 * @param Visible

 * @default true

 * @desc �\�����

 * 

 * @param Location

 * @default 0 0

 * @desc ���W[X Y]��ݒ�

 * 

 * @param Size

 * @default 100 100

 * @desc �摜�̃T�C�Y[Width Height]��ݒ�

 * 

 * @param Margin

 * @default 0 0

 * @desc ���g�̗]��(�㉺)[MarginTop MarginBottom]���w��

 * 

 * @help ���T�v

 * Skittle�v���O�C���𗘗p����ɂ̓v���O�C���R�}���h������s���܂��B

 * �v���O�C���R�}���h�����s����ƃC�x���g���Ń��[�^�[�̑����A�\�����s���܂��B

 * 

 * ���v���O�C���R�}���h

 *   Skittle add [�����l]            # �Q�[�W�̑������s��

 *   Skittle visivle [�\�����]      # �Q�[�W�̕\����Ԃ𐧌�

 */



/* 

 * ���ʏ����n

 */

var parseIntStrict = function (value) {

    var result = parseInt(value, 10);

    if (isNaN(result)) result = 0;

    return result;

};



/*

 * ���g

 */

 var Content = (function () {

    // �N���X�ϐ�

    var sprite = null;



    // �R���X�g���N�^

    var Content = function (skittle, location, size, parameters) {

        if (!(this instanceof Content)) {

            return new Content(skittle, fileName, location, size, margin);

        }

        this.skittle = skittle;

        this.size = size;

        this.remains = 0;



        var fileName = parameters['Content'] || '';

        this.margin = parameters['Margin'].split(' ').map(s => parseIntStrict(s));

        this.variable = parseIntStrict(parameters['Variable']) || 0;



        this.LoadSprite(fileName, location, size);

        this.ReflectsRemainigHeight();

    }



    // �v���g�^�C�v���Ń��\�b�h���`

    Content.prototype.LoadSprite = function (fileName, location, size) {

        sprite = new Sprite();

        sprite.bitmap = ImageManager.loadSystem(fileName);

        sprite.x = location[0] + size[0];

        sprite.y = location[1] + size[1];

        sprite.rotation = 180 * Math.PI / 180;

    }



    Content.prototype.Scale = function () {

        // �����ȉ摜�����̍��� / �Q�[�W�̍ő��

        return (this.size[1] - this.margin[0] - this.margin[1]) / this.skittle.Capacity;

    }

    Content.prototype.RemainingHeight = function () {

        // �]���������������ĉ摜�̕\�����𒲐�

        return this.remains * this.Scale() - this.margin[1];

    }



    Content.prototype.Sprite = function () {

        return sprite;

    }

    Content.prototype.getX = function () {

        return this.Sprite().x;

    }

    Content.prototype.getY = function () {

        return this.Sprite().y;

    }



    Content.prototype.ReflectsRemainigHeight = function () {

        this.Sprite().setFrame(0, 0, this.size[0], this.RemainingHeight());

    }



    Content.prototype.setValue = function (value) {

        this.remains += value;

        if (this.remains < 0) this.remains = 0;

        if (this.remains > this.skittle.Capacity) this.remains = this.skittle.Capacity;

        this.ReflectsRemainigHeight();

        $gameVariables.setValue(this.variable, this.remains);

    }



    return Content;

})();



/* 

 *�{��

 */

var Skittle = (function () {

    // �N���X���ϐ�

    var parameters = null;

    // �R���X�g���N�^

    var Skittle = function () {

        if (!(this instanceof Skittle)) {

            return new Skittle();

        }

        this.isFirst = true;

        this.IsDisp = true;

        this.startAnimetion = false;

        this.animeContents = '';

        this.addContent = 0;

        this.initialize();

    }



    Skittle.prototype.clearValue = function () {

        this.clearAnimetion();

        this.addContent = 0;

    }



    Skittle.prototype.clearAnimetion = function () {

        this.animeContents = '';

        this.startAnimetion = false;

    };



    // �v���g�^�C�v���Ń��\�b�h���`

    Skittle.prototype.initialize = function () {

        parameters = PluginManager.parameters('Skittle');



        var container = parameters['Container'] || '';

        var location = parameters['Location'].split(' ').map(s => parseIntStrict(s));

        var size = parameters['Size'].split(' ').map(s => parseIntStrict(s));

        this.IsDisp = eval(parameters['Visible']);

        this.Displyed = !this.IsDisp;

        this.Capacity = parseIntStrict(parameters['Capacity']) || 0;



        // ���g�̕`��

        this.content = new Content(this, location, size, parameters);

        this.content.setValue(parseIntStrict(parameters['Default']) || 0);



        // �e��̕`��

        this.LoadSprite(container, location);



        this.clearValue();

    }



    Skittle.prototype.LoadSprite = function (fileName, location) {

        sprite = new Sprite();

        sprite.bitmap = ImageManager.loadSystem(fileName);

        sprite.x = location[0];

        sprite.y = location[1];

    }



    Skittle.prototype.Sprite = function () {

        return sprite;

    }



    Skittle.prototype.setParameter = function (args) {

        //parse

        if (args.length < 2) {

            throw new SyntaxError("setParameter: args is invalid.");

        }

        this.animeContents = args[0];

        if (args[0] == 'visible') {

            this.IsDisp = eval(args[1]);

        } else {

            this.addContent = parseIntStrict(args[1]);

            this.startAnimetion = true;

        }

        return true;

    };



    Skittle.prototype.update = function () {

        if (this.startAnimetion) {

            if (this.animeContents == 'add') {

                //�Q�[�W�̃A�j���[�V�������s��

                if (this.addContent > 0) {

                    var add = 1;

                    this.addContent -= add;

                    this.content.setValue(add);

                } 

                else if (this.addContent < 0) {

                    var add = -1

                    this.addContent -= add;

                    this.content.setValue(add);

                } 

                else {

                    this.startAnimetion = false;

                }

            }

        }

        return true;

    };



    return Skittle;

})();



// �O���[�o���ϐ�

var $skittle = null;



/*

 * �C���X�^���X�̐���

 * �v���O�C�����s

 * �Z�[�u�f�[�^�̕ۑ��E�ǂݍ���

 * ���[�^�[�̕\������

 */

(function () {

    //-----------------------------------------------------------------------------

    // �C���X�^���X�̐����i�Q�[���N�����ɌĂ΂��j

    //-----------------------------------------------------------------------------

    var createGameObjects = DataManager.createGameObjects;

    DataManager.createGameObjects = function () {

        createGameObjects.call(this);



        // �Q�[�W�̍쐬

        $skittle = new Skittle();

    };



    //-----------------------------------------------------------------------------

    // �v���O�C�����s

    //-----------------------------------------------------------------------------

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function (command, args) {

        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === 'Skittle') {

            switch (args[0]) {

                case 'add':

                case 'visible':

                    //�����������l��ݒ肵����

                    //�\�����邩�̐ݒ��������

                    if ($skittle.startAnimetion) return;

                    $skittle.setParameter(args);

                    break;

                default:

                    break;

            }

        }

    };



    //-----------------------------------------------------------------------------

    // �Z�[�u�f�[�^�̐���

    //-----------------------------------------------------------------------------

    var makeSaveContents = DataManager.makeSaveContents;

    DataManager.makeSaveContents = function () {

        // �Z�[�u�f�[�^�{��

        var contents = makeSaveContents.call(this);



        // �Q�[�W���Z�[�u�f�[�^�ɐݒ肷��B

        contents.skittle = $skittle;

        return contents;

    };



    //-----------------------------------------------------------------------------

    // �Z�[�u�f�[�^�̓ǂݍ���

    //-----------------------------------------------------------------------------

    var extractSaveContents = DataManager.extractSaveContents;

    DataManager.extractSaveContents = function (contents) {

        // �Z�[�u�f�[�^�{�̂��擾

        extractSaveContents.call(this, contents);



        // Skittle��ǂݍ���

        $skittle = contents.skittle;

        $skittle.content.ReflectsRemainigHeight();

    };



    //-----------------------------------------------------------------------------

    // ���[�^�[�̕\������

    // �摜�̕\���E��\���͎q�̒ǉ��E�폜�őΉ�

    //-----------------------------------------------------------------------------

    var _Spriteset_Map = Spriteset_Map.prototype.update;

    Spriteset_Map.prototype.update = function () {

        _Spriteset_Map.call(this);

        $skittle.update();

        // �Q�[�W���\����ԂɂȂ��Ă��Ȃ��ꍇ�ŕ\���t���O��ON�̏ꍇ�ɕ\��

        if ($skittle != null && $skittle.IsDisp) {

            $skittle.Displyed = true;

            this.addChild($skittle.content.Sprite());

            this.addChild($skittle.Sprite());

        }

        // �Q�[�W����\����ԂɂȂ��Ă��Ȃ��ꍇ�ŕ\���t���O��OFF�̏ꍇ�ɕ\��

        else if ($skittle != null && !$skittle.IsDisp) {

            $skittle.Displyed = false;

            this.removeChild($skittle.content.Sprite());

            this.removeChild($skittle.Sprite());

        }

    };

})();