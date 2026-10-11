/* ZiruPDF website — UI text of the online tools in the page language.
 * The page language comes from <html lang> (zh-CN / ja / en). Chinese is the key;
 * {0}, {1}… are filled in order. Missing entries fall back to the Chinese text.
 * Only messages shown to the user are listed; tool logic does not depend on them. */
(function () {
  'use strict';
  var lang = String(document.documentElement.lang || 'zh').slice(0, 2).toLowerCase();
  var D = {
    ja: {
      '图片转 PDF': '画像を PDF に', '图片缩放': '画像のリサイズ', 'PNG 转 ICO': 'PNG を ICO に',
      '每张图片一页；使用上移、下移调整顺序。': '画像 1 枚が 1 ページになります。「上へ」「下へ」で順番を調整します。',
      '生成包含七种尺寸的图标，保留透明背景。': '7 種類のサイズを含むアイコンを作成し、透明な背景を保ちます。',
      '保持图片比例，设置最长边后生成 PNG。': '縦横比を保ち、最長辺を指定して PNG を作成します。',
      '处理预览': '処理後のプレビュー', '图片编码失败': '画像の保存に失敗しました',
      '每次最多 20 张，请减少所选图片。': '一度に選べるのは 20 枚までです。選択する画像を減らしてください。',
      '超过 20 MB': '20 MB を超えています', '不支持此格式': 'この形式には対応していません', '超过 1600 万像素': '1600 万ピクセルを超えています',
      '已选择 {0} 张图片。': '{0} 枚の画像を選択しました。', '下载 {0}': '{0} をダウンロード',
      '最长边请输入 16–4096 的整数。': '最長辺には 16～4096 の整数を入力してください。',
      '正在本地处理…': 'このデバイスで処理しています…', '已生成，请点击下载链接保存。': '作成しました。ダウンロードリンクをクリックして保存してください。',
      '处理失败：{0}': '処理に失敗しました：{0}', '{0}：{1}': '{0}：{1}', '；': '；',
      '上移': '上へ', '下移': '下へ', '移除': '削除', '删除': '削除', '逆时针旋转': '左に回転', '顺时针旋转': '右に回転', '删除此页': 'このページを削除',
      '向左旋转': '左に回転', '向右旋转': '右に回転', '恢复完整图片': '画像全体に戻す',
      'PDF 合并': 'PDF 結合', 'PDF 提取／拆分': 'PDF 抽出／分割', 'PDF 旋转／删除／排序': 'PDF の回転・削除・並べ替え', 'PDF 转图片': 'PDF を画像に', 'PDF 水印／页码': 'PDF の透かし／ページ番号',
      '证件复印件用途水印': '身分証明書コピーの用途透かし',
      '调整文件顺序，再生成合并文件。': 'ファイルの順番を調整してから、結合したファイルを作成します。',
      '勾选要处理的页面；页码范围对应下方当前显示顺序。': '処理するページにチェックを入れます。ページ範囲は下に表示されている現在の順番に対応します。',
      '{0} · {1} 页': '{0} · {1} ページ',
      '水印页面过大，请使用电脑软件处理': '透かしを入れるページが大きすぎます。パソコン用ソフトで処理してください',
      '页面输出过大，请选择较低分辨率': '出力するページが大きすぎます。解像度を下げてください',
      ' 第 {0} 页': ' {0} ページ目', '预览失败：{0}': 'プレビューに失敗しました：{0}',
      '最多 20 个 PDF': 'PDF は 20 個までです', '此工具一次处理一个 PDF': 'このツールで一度に処理できる PDF は 1 つです',
      '文件合计不能超过 100 MB': 'ファイルの合計は 100 MB までです', '正在本地读取…': 'このデバイスで読み込んでいます…',
      '暂不支持加密 PDF，请在电脑软件中解除密码': '暗号化された PDF には対応していません。パソコン用ソフトでパスワードを解除してください',
      '最多处理 200 页': '処理できるのは 200 ページまでです', '已读取 {0} 页。': '{0} ページを読み込みました。', '无法读取：{0}': '読み込めません：{0}',
      '请输入如 1-3,5 的页码': '1-3,5 のようにページ番号を入力してください', '页码超出范围': 'ページ番号が範囲外です',
      '已选择 {0} 页。': '{0} ページを選択しました。', '正在本地生成…': 'このデバイスで作成しています…',
      '请填写接收方和用途': '提出先と用途を入力してください', '生成失败：{0}': '作成に失敗しました：{0}',
      '仅供{0}办理{1}使用 · {2}': '{0}への{1}提出用に限る · {2}', '指定接收方': '指定の提出先', '指定用途': '指定の用途',
      '图片格式转换': '画像の形式変換', '图片裁剪／旋转': '画像のトリミング／回転', '图片压缩': '画像の圧縮', '图片压缩到指定大小': '画像を指定サイズに圧縮',
      '在预览图片上拖出裁剪范围，旋转后可以重新选择。': 'プレビュー画像上でドラッグして切り抜き範囲を選びます。回転後に選び直せます。',
      '调整质量，查看编码后的预览和实际大小；不保证所有图片都能变小。': '品質を調整し、保存後のプレビューと実際のサイズを確認します。すべての画像が小さくなるとは限りません。',
      '选择输出格式，PNG 和 WebP 可保留透明背景，JPG 使用白色背景。': '出力形式を選びます。PNG と WebP は透明な背景を保ち、JPG は白い背景になります。',
      '输入大小上限，自动尝试质量和尺寸。预览显示真实输出；无法达标时不会标记为成功。': 'サイズの上限を入力すると、品質と寸法を自動で調整します。プレビューは実際の出力です。条件を満たせない場合は成功として扱いません。',
      '{0} × {1} 像素': '{0} × {1} ピクセル', ' → 裁剪 {0} × {1}': ' → 切り抜き {0} × {1}', '输出效果预览': '出力のプレビュー',
      '大小请输入 1–51200 KB；最小最长边请输入 64–4096 像素': 'サイズは 1～51200 KB、最長辺の最小値は 64～4096 ピクセルで入力してください',
      '；比原文件大': '；元のファイルより大きくなりました',
      '原文件 {0} KB → 输出 {1} KB · {2} × {3} · 质量 {4}%': '元のファイル {0} KB → 出力 {1} KB · {2} × {3} · 品質 {4}%',
      ' · 已达到上限': ' · 上限内に収まりました', ' · 未达到上限：请增大上限或降低最小尺寸': ' · 上限に届きません：上限を上げるか最小サイズを下げてください',
      '原文件 {0} KB → 输出 {1} KB': '元のファイル {0} KB → 出力 {1} KB', '（比原文件大）': '（元のファイルより大きい）',
      '最多 20 张图片': '画像は 20 枚までです', '浏览器不支持此输出格式，请选择 PNG 或 JPG': 'お使いのブラウザーはこの出力形式に対応していません。PNG または JPG を選んでください',
      '下载 {0}（{1} KB）': '{0} をダウンロード（{1} KB）',
      '部分或全部图片未达到大小上限，请查看各图片说明并调整设置。': '一部またはすべての画像がサイズの上限に届きませんでした。各画像の説明を確認して設定を調整してください。'
    },
    en: {
      '图片转 PDF': 'Images to PDF', '图片缩放': 'Resize image', 'PNG 转 ICO': 'PNG to ICO',
      '每张图片一页；使用上移、下移调整顺序。': 'One page per image; use Up and Down to change the order.',
      '生成包含七种尺寸的图标，保留透明背景。': 'Creates an icon with seven sizes and keeps the transparent background.',
      '保持图片比例，设置最长边后生成 PNG。': 'Keeps proportions; set the longest edge to create a PNG.',
      '处理预览': 'Processed preview', '图片编码失败': 'Image encoding failed',
      '每次最多 20 张，请减少所选图片。': 'Up to 20 images at a time — please select fewer.',
      '超过 20 MB': 'larger than 20 MB', '不支持此格式': 'format not supported', '超过 1600 万像素': 'more than 16 megapixels',
      '已选择 {0} 张图片。': '{0} image(s) selected.', '下载 {0}': 'Download {0}',
      '最长边请输入 16–4096 的整数。': 'Enter a whole number from 16 to 4096 for the longest edge.',
      '正在本地处理…': 'Processing on this device…', '已生成，请点击下载链接保存。': 'Done. Click the download link to save.',
      '处理失败：{0}': 'Processing failed: {0}', '{0}：{1}': '{0}: {1}', '；': '; ',
      '上移': 'Up', '下移': 'Down', '移除': 'Remove', '删除': 'Delete', '逆时针旋转': 'Rotate left', '顺时针旋转': 'Rotate right', '删除此页': 'Delete this page',
      '向左旋转': 'Rotate left', '向右旋转': 'Rotate right', '恢复完整图片': 'Restore full image',
      'PDF 合并': 'Merge PDF', 'PDF 提取／拆分': 'Extract / split PDF', 'PDF 旋转／删除／排序': 'Rotate, delete and reorder PDF pages', 'PDF 转图片': 'PDF to image', 'PDF 水印／页码': 'PDF watermark / page numbers',
      '证件复印件用途水印': 'ID copy purpose watermark',
      '调整文件顺序，再生成合并文件。': 'Set the file order, then create the merged file.',
      '勾选要处理的页面；页码范围对应下方当前显示顺序。': 'Check the pages to process; page ranges follow the order currently shown below.',
      '{0} · {1} 页': '{0} · {1} page(s)',
      '水印页面过大，请使用电脑软件处理': 'Page too large for the watermark — please use the desktop app',
      '页面输出过大，请选择较低分辨率': 'Page output too large — please choose a lower resolution',
      ' 第 {0} 页': ' Page {0}', '预览失败：{0}': 'Preview failed: {0}',
      '最多 20 个 PDF': 'Up to 20 PDFs', '此工具一次处理一个 PDF': 'This tool handles one PDF at a time',
      '文件合计不能超过 100 MB': 'Files must total no more than 100 MB', '正在本地读取…': 'Reading on this device…',
      '暂不支持加密 PDF，请在电脑软件中解除密码': 'Encrypted PDFs are not supported — remove the password in the desktop app first',
      '最多处理 200 页': 'Up to 200 pages', '已读取 {0} 页。': '{0} page(s) loaded.', '无法读取：{0}': 'Cannot read: {0}',
      '请输入如 1-3,5 的页码': 'Enter pages like 1-3,5', '页码超出范围': 'Page number out of range',
      '已选择 {0} 页。': '{0} page(s) selected.', '正在本地生成…': 'Creating on this device…',
      '请填写接收方和用途': 'Please enter the recipient and purpose', '生成失败：{0}': 'Creation failed: {0}',
      '仅供{0}办理{1}使用 · {2}': 'Copy for {0} only — {1} · {2}', '指定接收方': 'the named recipient', '指定用途': 'stated purpose',
      '图片格式转换': 'Convert image format', '图片裁剪／旋转': 'Crop / rotate image', '图片压缩': 'Compress image', '图片压缩到指定大小': 'Compress image to a size',
      '在预览图片上拖出裁剪范围，旋转后可以重新选择。': 'Drag on the preview to choose the crop area; you can choose again after rotating.',
      '调整质量，查看编码后的预览和实际大小；不保证所有图片都能变小。': 'Adjust the quality and check the encoded preview and actual size; not every image will get smaller.',
      '选择输出格式，PNG 和 WebP 可保留透明背景，JPG 使用白色背景。': 'Choose an output format. PNG and WebP keep transparency; JPG uses a white background.',
      '输入大小上限，自动尝试质量和尺寸。预览显示真实输出；无法达标时不会标记为成功。': 'Enter a size limit and the tool tries quality and dimensions automatically. The preview shows the real output; results that miss the limit are not marked as successful.',
      '{0} × {1} 像素': '{0} × {1} px', ' → 裁剪 {0} × {1}': ' → crop {0} × {1}', '输出效果预览': 'Output preview',
      '大小请输入 1–51200 KB；最小最长边请输入 64–4096 像素': 'Enter a size of 1–51200 KB and a minimum longest edge of 64–4096 px',
      '；比原文件大': '; larger than the original',
      '原文件 {0} KB → 输出 {1} KB · {2} × {3} · 质量 {4}%': 'Original {0} KB → output {1} KB · {2} × {3} · quality {4}%',
      ' · 已达到上限': ' · within the limit', ' · 未达到上限：请增大上限或降低最小尺寸': ' · limit not reached: raise the limit or lower the minimum size',
      '原文件 {0} KB → 输出 {1} KB': 'Original {0} KB → output {1} KB', '（比原文件大）': ' (larger than the original)',
      '最多 20 张图片': 'Up to 20 images', '浏览器不支持此输出格式，请选择 PNG 或 JPG': 'Your browser does not support this output format — please choose PNG or JPG',
      '下载 {0}（{1} KB）': 'Download {0} ({1} KB)',
      '部分或全部图片未达到大小上限，请查看各图片说明并调整设置。': 'Some or all images did not reach the size limit. Check the note under each image and adjust the settings.'
    }
  };
  var table = D[lang] || null;
  window.ZiruLang = lang === 'ja' || lang === 'en' ? lang : 'zh';
  window.ZiruT = function (s) {
    var args = arguments, t = (table && Object.prototype.hasOwnProperty.call(table, s)) ? table[s] : s;
    return String(t).replace(/\{(\d+)\}/g, function (m, i) { var v = args[+i + 1]; return v === undefined ? m : String(v); });
  };
})();
