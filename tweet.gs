// IFTTTにWebHookをPOSTする
function sendIFTTTWebHook(value) {
  var message = {
    "value1":value
  };

  var options = {
    "method":"POST",
    "headers": {
      "Content-Type":"application/json"
    },
    "payload":JSON.stringify(message)
  };
  
  UrlFetchApp.fetch("https://maker.ifttt.com/trigger/timeline/with/key/" + "キーを入力", options)
}

// ビジーwaitを使う方法
function sleep(waitMsec) {
  var startMsec = new Date();
 
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

// メイン
function main() {
  var sheet_Timeline = SpreadsheetApp.openById('ここにidを入力').getSheetByName('Timeline');//Timelineのシート
  var k = String.fromCharCode(10);//改行
  var nor_in_TL = 50;
  
  var value_name = null;
  var value_note = null;
  
  for(var i = 1; i < nor_in_TL; ++i){
    if(sheet_Timeline.getRange(i+1, 3).getValue() == "t"){
      
      if(sheet_Timeline.getRange(i, 3).getValue() == "Twitter用の列"){
        break;
      }
      
      value_name = sheet_Timeline.getRange(i, 1).getValue();
      value_note = sheet_Timeline.getRange(i, 2).getValue();
      sheet_Timeline.getRange(i, 3).setValue("t");
      break;
    }
  }
  
  if(value_name != null && value_name.indexOf(k) > -1){
    value_name = value_name.replace(k, " ");
  }
  var value = value_name + k + value_note;
  var count = Math.floor(value.length / 125);
  
  
  if(count > 0 && value_name != null){
    
    var stack = [];

    for(i = 0; i < count; ++i){
      stack.push(value.slice(i*125, (i+1)*125));
    }
    stack.push(value.slice(count*125));
    
    if(count > 1){
      sendIFTTTWebHook(stack[1] + k + "//続きは短ノートで!");
    }else{
      sendIFTTTWebHook(stack[1]);
    }
    
    sleep(5000);//時間を止めて、思い通りの順序でTweetさせる
    
    sendIFTTTWebHook(stack[0]);
    
    
    
  }else if(value_name != null){
     sendIFTTTWebHook(value);
  }
  
}

