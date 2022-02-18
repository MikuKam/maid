//=============================================================================
// PictureLoop.js
//=============================================================================

/*:
 * @plugindesc ピクチャをランダム間隔で表示させます
 * @author riru
 *
 * @param Pictureloop Count1
 * @desc まばたき用ベース間隔。
 * @default 60
 *
 * @param Pictureloop Count2
 * @desc まばたき用ランダム間隔。ベース間隔＋この数値までのランダムで出た間隔でまばたきします
 * @default 100
 *
 * @help
 *
 * まばたきプラグイン ver 1.02
 *
 *＜使い方＞
 *イベントコマンド「スクリプト」で以下のように記述してください
 *LoopPicture(ピクチャ番号,閉じかけ目ピクチャネーム,閉じ目ピクチャネーム, 原点, x, y, X拡大率, Y拡大率, 不透明度, 合成方法);
 *
 *ピクチャ番号…イベントコマンド「ピクチャの表示」の番号と同じです。数字が多いほど上に表示されます。通常のピクチャと共有なので、同時に表示させたいピクチャと番号が被らないようにしてください 
 *原点…〃表示位置と同じです。0で左上、1で中心が原点になりま
 *拡大率…100で原寸です。-をつけると反転します。
 *不透明度…0～255で設定できます。数字が低いほど透明になります 
 *合成方法…ピクチャの表示の合成方法と同じです。0で通常、1で加算、2で乗算になります
 *※数字の場所は
 *
 *例：LoopPicture(1,"actor1tojikake","actortoji", 0, 10, 80, -100, 100, 255, 0);
 *ピクチャ名が長い場合は代入してもOKです
 *name = "actor1tojikake";
 *name2 = "actor1tojikake";
 *x = $gameVariables.value(5);
 *y = $gameVariables.value(6);
 *LoopPicture(7,name,name2, 0, x, y, 100, 100, 255, 0);
 *
 *瞬きをとめる場合は同じくイベントコマンドスクリプトで以下を記入
 *EraseLoopPicture(瞬きしているピクチャ番号);
 *例：EraseLoopPicture(7);
 * ＜規約＞
 * 有償無償問わず使用できます。改変もご自由にどうぞ。使用報告もいりません。２次配布は作成者を偽らなければOKです（ただし素材単品を有償でやりとりするのはNG）。
 *著作権は放棄していません。使用する場合は以下の作者とURLをreadmeなどどこかに記載してください
 *
 * ＜作者情報＞
 *作者：riru 
 *HP：ガラス細工の夢幻
 *URL：http://garasuzaikunomugen.web.fc2.com/index.html
 *
 *＜更新情報＞
 *2015/11/21　1.00公開。
 *2015/12/23　1.01。バトル中では反映されない不具合を修正。
 *2019/6/3　1.02。まばたきを止める時に条件によってどのピクチャ番号を入れても止まってしまう不具合を修正。
 */

    var parameters = PluginManager.parameters('PictureLoop');
    var PictureloopCount1 = Number(parameters['Pictureloop Count1'] || 60);
    var PictureloopCount2 = Number(parameters['Pictureloop Count2'] || 100);

 function LoopPicture(layer,name,name2, origin, x, y, scaleX, scaleY, opacity, blendMode) {
    　  $gameScreen.CreateLoopPictureCount(layer);
        $gameScreen.CreateLoopPicture(layer,name,name2, origin, x, y, scaleX, scaleY, opacity, blendMode);
};
 LoopPictures  = new Array(100);
 LoopPictureCount_rand = new Array(100);
 LoopPicture_v = 0;//現在瞬きしている数
 //まばたき用ピクチャの消去
  function EraseLoopPicture(layer) {
 if (typeof !LoopPictures[layer] == null) LoopPicture_v -= 1;
     LoopPictureCount[layer] = null;
     LoopPictures[layer] = null;
    var realPictureId = $gameScreen.realPictureId(layer);
   if ($gameScreen._pictures[realPictureId] != null) $gameScreen.erasePicture(layer);
};
 //ループピクチャの情報作成
 Game_Screen.prototype.CreateLoopPicture = function(layer,name,name2, origin, x, y, scaleX, scaleY, opacity, blendMode) {
     LoopPictures[layer] = [layer,name,name2, origin, x, y, scaleX, scaleY, opacity, blendMode];
     LoopPicture_v += 1;
LoopPictureCount_rand[layer] = [];
   LoopPictureCount_rand[layer] = (Math.floor((Math.random()*PictureloopCount2+1)+PictureloopCount1)) ;//瞬きの間隔を作成
};
   var  picture_loop_flug = false;//まばたきしているか？

 //ループピクチャの情報作成
    var LoopPictureCount =[];//new Array();
 Game_Screen.prototype.CreateLoopPictureCount = function(layer) {
     LoopPictureCount[layer] = 0;
     picture_loop_flug = true;//まばたきしているか？
     
};
 //まばたき用ピクチャループ
 Game_Screen.prototype.LoopPicture = function(layer,name,name2, origin, x, y, scaleX, scaleY, opacity, blendMode) {
    switch ( LoopPictureCount[layer]) {
    case  LoopPictureCount_rand[layer]:
      //閉じかけ目表示
          //  alert(layer);
       $gameScreen.showPicture(layer,name, origin, x, y, scaleX, scaleY, opacity, blendMode);
       break;
    case   LoopPictureCount_rand[layer]+10:
      //閉じかけ目表示
       $gameScreen.showPicture(layer,name, origin, x, y, scaleX, scaleY, opacity, blendMode);
       break;
    case  LoopPictureCount_rand[layer]+5:
      //閉じ目表示
       $gameScreen.showPicture(layer,name2, origin, x, y, scaleX, scaleY, opacity, blendMode);
       break;
    case  LoopPictureCount_rand[layer]+15:
       $gameScreen.erasePicture(layer);
      LoopPictureCount[layer] = 0;
     LoopPictureCount_rand[layer] = Math.floor((Math.random()*PictureloopCount2+1)+PictureloopCount1) ;//瞬きの間隔を作成
      break;
     default:
      break;
    } 
};

//フレーム更新
var RiruPictureloop_Update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function(sceneActive) {
    RiruPictureloop_Update.call(this,sceneActive);
    this.updateLooppicture();//riru追加
};
//まばたき更新
Game_Screen.prototype.updateLooppicture = function() {
    if( picture_loop_flug == true){
          var j = 0;
      for (i=1;i<101;i++){
          if (j == LoopPicture_v) break;
        if (LoopPictures[i] != null){
      var layer = LoopPictures[i];
         if (LoopPictureCount[LoopPictures[i][0]] != null){
           LoopPictureCount[LoopPictures[i][0]] += 1;
            this.LoopPicture(layer[0],layer[1],layer[2], layer[3], layer[4], layer[5], layer[6], layer[7], layer[8], layer[9],layer[10]);
         }    
        }
      } 
    }
};
