"use strict";
/* Wörterbuch der Oberfläche. Je Zeile: Deutsch § English § Français § 中文 § Русский § हिन्दी § Latina */
const I18N_TSV = `
Scriptoria-Whiteboard§Scriptoria whiteboard§Tableau Scriptoria§Scriptoria 白板§Доска Scriptoria§Scriptoria व्हाइटबोर्ड§Tabula Scriptoria
Whiteboard§Whiteboard§Tableau blanc§白板§Доска§व्हाइटबोर्ड§Tabula alba
Elektrotechnik§Electrical engineering§Électrotechnique§电气工程§Электротехника§विद्युत अभियांत्रिकी§Electrotechnica
Schriftrolle§Scroll§Rouleau§卷轴§Свиток§पांडुलिपि§Volumen
Kreidetafel§Chalkboard§Tableau noir§黑板§Меловая доска§चॉकबोर्ड§Tabula cretacea
Papyrus§Papyrus§Papyrus§纸莎草纸§Папирус§पपाइरस§Papyrus
Wachstafel§Wax tablet§Tablette de cire§蜡板§Восковая табличка§मोम पट्टिका§Tabula cerata
Sandtafel§Sand table§Table de sable§沙盘§Песочная доска§रेत पट्टिका§Abacus harenae
Tontafel§Clay tablet§Tablette d’argile§泥板§Глиняная табличка§मिट्टी की पट्टिका§Tabula fictilis
Schiefertafel§Slate§Ardoise§石板§Грифельная доска§स्लेट§Tabula saxea
Pergament§Parchment§Parchemin§羊皮纸§Пергамент§चर्मपत्र§Membrana
Unbenanntes Whiteboard§Untitled whiteboard§Tableau sans titre§未命名白板§Доска без названия§बिना नाम का व्हाइटबोर्ड§Tabula sine nomine
Whiteboard konnte nicht geladen werden.§The whiteboard could not be loaded.§Impossible de charger le tableau.§无法加载白板。§Не удалось загрузить доску.§व्हाइटबोर्ड लोड नहीं हो सका।§Tabula aperiri non potuit.
Die Datei ist beschädigt.§The file is damaged.§Le fichier est endommagé.§文件已损坏。§Файл повреждён.§फ़ाइल क्षतिग्रस्त है।§Fasciculus corruptus est.
Änderungen …§Changes …§Modifications …§更改中 …§Изменения …§बदलाव …§Mutationes …
Speichert …§Saving …§Enregistrement …§正在保存 …§Сохранение …§सहेजा जा रहा है …§Servatur …
✓ Gespeichert§✓ Saved§✓ Enregistré§✓ 已保存§✓ Сохранено§✓ सहेजा गया§✓ Servatum
⚠ Nicht gespeichert§⚠ Not saved§⚠ Non enregistré§⚠ 未保存§⚠ Не сохранено§⚠ सहेजा नहीं गया§⚠ Non servatum
⚠ Nur vorübergehend§⚠ Temporary only§⚠ Temporaire seulement§⚠ 仅临时§⚠ Только временно§⚠ केवल अस्थायी§⚠ Ad tempus tantum
Der Browser erlaubt hier keinen dauerhaften Speicher (z. B. privates Fenster). Bitte mit Strg+S als Datei sichern.§The browser does not allow permanent storage here (e.g. private window). Please save as a file with Ctrl+S.§Le navigateur n’autorise pas de stockage permanent ici (p. ex. fenêtre privée). Enregistrez avec Ctrl+S comme fichier.§浏览器在此不允许永久存储（例如隐私窗口）。请按 Ctrl+S 另存为文件。§Браузер не разрешает здесь постоянное хранение (например, приватное окно). Сохраните файл через Ctrl+S.§ब्राउज़र यहाँ स्थायी संग्रहण की अनुमति नहीं देता (जैसे निजी विंडो)। कृपया Ctrl+S से फ़ाइल के रूप में सहेजें।§Navigatrum hic memoriam perpetuam non sinit (e.g. fenestra privata). Quaeso Ctrl+S fasciculum serva.
Speichern fehlgeschlagen. Bitte mit Strg+S als Datei sichern.§Saving failed. Please save as a file with Ctrl+S.§Échec de l’enregistrement. Enregistrez avec Ctrl+S comme fichier.§保存失败。请按 Ctrl+S 另存为文件。§Не удалось сохранить. Сохраните файл через Ctrl+S.§सहेजना विफल। कृपया Ctrl+S से फ़ाइल के रूप में सहेजें।§Servare non successit. Quaeso Ctrl+S fasciculum serva.
Wird automatisch im Browser gespeichert. Mit Strg+S zusätzlich als Datei sichern.§Saved automatically in the browser. Press Ctrl+S to also save a file.§Enregistré automatiquement dans le navigateur. Ctrl+S enregistre aussi un fichier.§自动保存在浏览器中。按 Ctrl+S 可另存为文件。§Сохраняется автоматически в браузере. Ctrl+S — дополнительно в файл.§ब्राउज़र में अपने-आप सहेजा जाता है। Ctrl+S से फ़ाइल के रूप में भी सहेजें।§Sponte in navigatro servatur. Ctrl+S etiam fasciculum serva.
– bitte mit Strg+S als Datei sichern.§– please save as a file with Ctrl+S.§– enregistrez avec Ctrl+S comme fichier.§– 请按 Ctrl+S 另存为文件。§– сохраните файл через Ctrl+S.§– कृपया Ctrl+S से फ़ाइल सहेजें।§– quaeso Ctrl+S fasciculum serva.
Das ist keine gültige Whiteboard-Datei.§This is not a valid whiteboard file.§Ce n’est pas un fichier de tableau valide.§这不是有效的白板文件。§Это не файл доски.§यह मान्य व्हाइटबोर्ड फ़ाइल नहीं है।§Hic fasciculus tabulae non est.
Importiertes Whiteboard§Imported whiteboard§Tableau importé§导入的白板§Импортированная доска§आयातित व्हाइटबोर्ड§Tabula importata
Alle Dateien§All files§Tous les fichiers§所有文件§Все файлы§सभी फ़ाइलें§Omnes fasciculi
PDF wird geöffnet …§Opening PDF …§Ouverture du PDF …§正在打开 PDF …§Открытие PDF …§PDF खुल रहा है …§PDF aperitur …
Bitte mindestens eine Seite angeben.§Please enter at least one page.§Indiquez au moins une page.§请至少输入一页。§Укажите хотя бы одну страницу.§कृपया कम से कम एक पृष्ठ दें।§Saltem unam paginam indica.
Seiten§Pages§Pages§页面§Страницы§पृष्ठ§Paginae
z. B. 5-20 oder 1-3, 7, 10-12 · leer = alle§e.g. 5-20 or 1-3, 7, 10-12 · empty = all§p. ex. 5-20 ou 1-3, 7, 10-12 · vide = toutes§例如 5-20 或 1-3, 7, 10-12 · 留空 = 全部§напр. 5-20 или 1-3, 7, 10-12 · пусто = все§जैसे 5-20 या 1-3, 7, 10-12 · खाली = सभी§e.g. 5-20 vel 1-3, 7, 10-12 · vacuum = omnes
Einfügen§Insert§Insérer§插入§Вставить§डालें§Inserere
Jede als eigene Seite§Each as its own page§Chacune sur sa page§每页单独一页§Каждая отдельной страницей§प्रत्येक अलग पृष्ठ पर§Quaeque in sua pagina
Untereinander hier§Stacked here§Empilées ici§在此纵向排列§Друг под другом здесь§यहाँ एक के नीचे एक§Hic sub se invicem
Nebeneinander§Side by side§Côte à côte§并排§Рядом§साथ-साथ§Iuxta
„Nebeneinander“: so viele PDF-Seiten stehen in einer Reihe (bei „Jede als eigene Seite“ teilen sie sich eine Board-Seite).§“Side by side”: this many PDF pages are placed in one row (with “Each as its own page” they share one board page).§« Côte à côte » : nombre de pages PDF par rangée (avec « Chacune sur sa page », elles partagent une page du tableau).§“并排”：每行放置的 PDF 页数（选择“每页单独一页”时它们共用一个白板页）。§«Рядом»: столько страниц PDF в одном ряду (при «Каждая отдельной страницей» они делят одну страницу доски).§“साथ-साथ”: एक पंक्ति में इतने PDF पृष्ठ (“प्रत्येक अलग पृष्ठ पर” के साथ वे एक बोर्ड पृष्ठ साझा करते हैं)।§«Iuxta»: tot paginae PDF in uno ordine stant (cum «Quaeque in sua pagina» unam paginam tabulae communicant).
PDF einfügen§Insert PDF§Insérer un PDF§插入 PDF§Вставить PDF§PDF डालें§PDF inserere
Abbrechen§Cancel§Annuler§取消§Отмена§रद्द करें§Abrogare
Viele Seiten§Many pages§Beaucoup de pages§页数很多§Много страниц§बहुत सारे पृष्ठ§Multae paginae
Unterstützt werden Bilder (PNG, JPG, SVG, GIF, WebP), PDF und .owb-Dateien.§Supported: images (PNG, JPG, SVG, GIF, WebP), PDF and .owb files.§Formats pris en charge : images (PNG, JPG, SVG, GIF, WebP), PDF et fichiers .owb.§支持：图片（PNG、JPG、SVG、GIF、WebP）、PDF 和 .owb 文件。§Поддерживаются изображения (PNG, JPG, SVG, GIF, WebP), PDF и файлы .owb.§समर्थित: चित्र (PNG, JPG, SVG, GIF, WebP), PDF और .owb फ़ाइलें।§Admittuntur imagines (PNG, JPG, SVG, GIF, WebP), PDF et fasciculi .owb.
PDF eingefügt – die Seiten sind fixiert (Doppelklick zum Bearbeiten).§PDF inserted – the pages are locked (double-click to edit).§PDF inséré – les pages sont verrouillées (double-clic pour modifier).§PDF 已插入 – 页面已固定（双击可编辑）。§PDF вставлен – страницы закреплены (двойной щелчок для правки).§PDF डाला गया – पृष्ठ स्थिर हैं (संपादन हेतु डबल-क्लिक)।§PDF insertum – paginae fixae sunt (bis preme ut mutes).
Das Whiteboard ist leer.§The whiteboard is empty.§Le tableau est vide.§白板为空。§Доска пуста.§व्हाइटबोर्ड खाली है।§Tabula vacua est.
PNG-Bild§PNG image§Image PNG§PNG 图片§Изображение PNG§PNG चित्र§Imago PNG
PNG exportiert.§PNG exported.§PNG exporté.§PNG 已导出。§PNG экспортирован.§PNG निर्यात हुआ।§PNG exportata.
PDF-Dokument§PDF document§Document PDF§PDF 文档§Документ PDF§PDF दस्तावेज़§Documentum PDF
PDF exportiert.§PDF exported.§PDF exporté.§PDF 已导出。§PDF экспортирован.§PDF निर्यात हुआ।§PDF exportatum.
Mehr§More§Plus§更多§Ещё§और§Plura
Öffnen§Open§Ouvrir§打开§Открыть§खोलें§Aperire
Umbenennen …§Rename …§Renommer …§重命名 …§Переименовать …§नाम बदलें …§Renominare …
Umbenennen§Rename§Renommer§重命名§Переименовать§नाम बदलें§Renominare
Neuer Name§New name§Nouveau nom§新名称§Новое имя§नया नाम§Nomen novum
Duplizieren§Duplicate§Dupliquer§复制§Дублировать§प्रतिलिपि बनाएँ§Duplicare
(Kopie)§(copy)§(copie)§（副本）§(копия)§(प्रति)§(exemplar)
Als Datei speichern (.owb) …§Save as file (.owb) …§Enregistrer comme fichier (.owb) …§另存为文件 (.owb) …§Сохранить как файл (.owb) …§फ़ाइल के रूप में सहेजें (.owb) …§Ut fasciculum servare (.owb) …
Löschen …§Delete …§Supprimer …§删除 …§Удалить …§हटाएँ …§Delere …
Whiteboard löschen§Delete whiteboard§Supprimer le tableau§删除白板§Удалить доску§व्हाइटबोर्ड हटाएँ§Tabulam delere
Löschen§Delete§Supprimer§删除§Удалить§हटाएँ§Delere
Neues Whiteboard§New whiteboard§Nouveau tableau§新建白板§Новая доска§नया व्हाइटबोर्ड§Nova tabula
＋ Neues Whiteboard§＋ New whiteboard§＋ Nouveau tableau§＋ 新建白板§＋ Новая доска§＋ नया व्हाइटबोर्ड§＋ Nova tabula
Leere Fläche öffnen§Open a blank canvas§Ouvrir une surface vide§打开空白画布§Открыть пустое поле§खाली सतह खोलें§Superficiem vacuam aperire
Gespeichert.§Saved.§Enregistré.§已保存。§Сохранено.§सहेजा गया।§Servatum.
Datei konnte nicht geöffnet werden.§The file could not be opened.§Impossible d’ouvrir le fichier.§无法打开文件。§Не удалось открыть файл.§फ़ाइल नहीं खुल सकी।§Fasciculus aperiri non potuit.
Achtung: Dieser Browser erlaubt hier keinen dauerhaften Speicher (z. B. privates Fenster). Sichern Sie Ihre Boards mit Strg+S als Datei.§Note: this browser does not allow permanent storage here (e.g. private window). Save your boards as files with Ctrl+S.§Attention : ce navigateur n’autorise pas de stockage permanent ici (p. ex. fenêtre privée). Enregistrez vos tableaux avec Ctrl+S.§注意：此浏览器在此不允许永久存储（例如隐私窗口）。请按 Ctrl+S 将白板另存为文件。§Внимание: браузер не разрешает здесь постоянное хранение (например, приватное окно). Сохраняйте доски через Ctrl+S.§ध्यान दें: यह ब्राउज़र यहाँ स्थायी संग्रहण की अनुमति नहीं देता (जैसे निजी विंडो)। अपने बोर्ड Ctrl+S से फ़ाइल के रूप में सहेजें।§Cave: hoc navigatrum memoriam perpetuam non sinit (e.g. fenestra privata). Tabulas Ctrl+S ut fasciculos serva.
Achtung: Dein Browser erlaubt kein dauerhaftes Speichern (privates Fenster?). Speichere wichtige Boards mit Strg+S als Datei.§Note: your browser does not allow permanent storage (private window?). Save important boards as files with Ctrl+S.§Attention : votre navigateur n’autorise pas le stockage permanent (fenêtre privée ?). Enregistrez les tableaux importants avec Ctrl+S.§注意：浏览器不允许永久存储（隐私窗口？）。请按 Ctrl+S 保存重要白板。§Внимание: браузер не разрешает постоянное хранение (приватное окно?). Сохраняйте важные доски через Ctrl+S.§ध्यान दें: आपका ब्राउज़र स्थायी संग्रहण की अनुमति नहीं देता (निजी विंडो?)। महत्वपूर्ण बोर्ड Ctrl+S से सहेजें।§Cave: navigatrum memoriam perpetuam non sinit (fenestra privata?). Tabulas graves Ctrl+S serva.
Schließen§Close§Fermer§关闭§Закрыть§बंद करें§Claudere
Fehler§Error§Erreur§错误§Ошибка§त्रुटि§Error
Rechteck§Rectangle§Rectangle§矩形§Прямоугольник§आयत§Rectangulum
Dreieck§Triangle§Triangle§三角波§Треугольник§त्रिभुज§Triangulum
Sägezahn§Sawtooth§Dents de scie§锯齿波§Пила§आरी-दांत§Serra
Einweg-Gleichrichtung§Half-wave rectification§Redressement simple alternance§半波整流§Однополупериодное выпрямление§अर्ध-तरंग दिष्टकरण§Rectificatio dimidiae undae
Zweiweg-Gleichrichtung§Full-wave rectification§Redressement double alternance§全波整流§Двухполупериодное выпрямление§पूर्ण-तरंग दिष्टकरण§Rectificatio totius undae
Sinus mit 3. Oberwelle§Sine with 3rd harmonic§Sinus avec 3e harmonique§含三次谐波的正弦§Синус с 3-й гармоникой§तीसरे हार्मोनिक सहित साइन§Sinus cum harmonica tertia
Rechteckpuls (25 %)§Rectangular pulse (25 %)§Impulsion rectangulaire (25 %)§矩形脉冲 (25 %)§Прямоугольный импульс (25 %)§आयताकार पल्स (25 %)§Pulsus rectangulus (25 %)
Petit Fourier§Petit Fourier§Petit Fourier§小傅里叶§Petit Fourier§पेटिट फ़ूरिये§Petit Fourier
Vorlage …§Preset …§Modèle …§模板 …§Шаблон …§नमूना …§Exemplar …
Periode T muss größer als 0 sein.§Period T must be greater than 0.§La période T doit être supérieure à 0.§周期 T 必须大于 0。§Период T должен быть больше 0.§आवर्तकाल T, 0 से बड़ा होना चाहिए।§Periodus T maior quam 0 esse debet.
Periode T§Period T§Période T§周期 T§Период T§आवर्तकाल T§Periodus T
Harmonische§Harmonics§Harmoniques§谐波数§Гармоники§हार्मोनिक§Harmonicae
Variable t, Periode T. Erlaubt: sin, cos, exp, abs, sgn, frac, floor, pi … Beispiel: sin(2*pi*50*t) mit T = 20m§Variable t, period T. Allowed: sin, cos, exp, abs, sgn, frac, floor, pi … Example: sin(2*pi*50*t) with T = 20m§Variable t, période T. Autorisé : sin, cos, exp, abs, sgn, frac, floor, pi … Exemple : sin(2*pi*50*t) avec T = 20m§变量 t，周期 T。可用：sin、cos、exp、abs、sgn、frac、floor、pi … 例：sin(2*pi*50*t)，T = 20m§Переменная t, период T. Можно: sin, cos, exp, abs, sgn, frac, floor, pi … Пример: sin(2*pi*50*t) при T = 20m§चर t, आवर्तकाल T. अनुमत: sin, cos, exp, abs, sgn, frac, floor, pi … उदाहरण: sin(2*pi*50*t), T = 20m§Variabilis t, periodus T. Licent: sin, cos, exp, abs, sgn, frac, floor, pi … Exemplum: sin(2*pi*50*t) cum T = 20m
Berechnen§Calculate§Calculer§计算§Вычислить§गणना करें§Computare
Spektrum ins Board§Spectrum to board§Spectre sur le tableau§频谱插入白板§Спектр на доску§स्पेक्ट्रम बोर्ड पर§Spectrum in tabulam
Zeitverlauf (grau) und Summe der Harmonischen (blau)§Time signal (grey) and sum of harmonics (blue)§Signal temporel (gris) et somme des harmoniques (bleu)§时域波形（灰）与谐波之和（蓝）§Сигнал (серый) и сумма гармоник (синий)§समय संकेत (धूसर) और हार्मोनिकों का योग (नीला)§Cursus temporis (cinereus) et summa harmonicarum (caerulea)
Amplitudenspektrum§Amplitude spectrum§Spectre d’amplitude§幅度谱§Амплитудный спектр§आयाम स्पेक्ट्रम§Spectrum amplitudinis
Amplitude Aₙ§Amplitude Aₙ§Amplitude Aₙ§幅度 Aₙ§Амплитуда Aₙ§आयाम Aₙ§Amplitudo Aₙ
Phase φₙ§Phase φₙ§Phase φₙ§相位 φₙ§Фаза φₙ§कला φₙ§Phasis φₙ
0 (Gleichanteil)§0 (DC component)§0 (composante continue)§0（直流分量）§0 (постоянная составляющая)§0 (DC घटक)§0 (pars constans)
Spektrum eingefügt.§Spectrum inserted.§Spectre inséré.§频谱已插入。§Спектр вставлен.§स्पेक्ट्रम डाला गया।§Spectrum insertum.
Taschenrechner§Calculator§Calculatrice§计算器§Калькулятор§कैलकुलेटर§Calculatrum
Kein Ergebnis§No result§Aucun résultat§无结果§Нет результата§कोई परिणाम नहीं§Nullus exitus
Tastatur geht auch: Enter rechnet, Esc löscht§Keyboard works too: Enter calculates, Esc clears§Le clavier fonctionne aussi : Entrée calcule, Échap efface§也可用键盘：回车计算，Esc 清除§Можно с клавиатуры: Enter — вычислить, Esc — очистить§कीबोर्ड भी चलता है: Enter गणना, Esc साफ़§Claviatura quoque: Enter computat, Esc delet
Bleistift§Pencil§Crayon§铅笔§Карандаш§पेंसिल§Plumbum
Kugelschreiber§Ballpoint pen§Stylo à bille§圆珠笔§Шариковая ручка§बॉलपॉइंट पेन§Calamus globulosus
Füllfederhalter§Fountain pen§Stylo plume§钢笔§Перьевая ручка§फ़ाउंटेन पेन§Calamus fontanus
Edding§Marker§Marqueur§记号笔§Маркер§मार्कर§Signator
Textmarker gelb§Highlighter yellow§Surligneur jaune§荧光笔 黄§Текстовыделитель жёлтый§हाइलाइटर पीला§Illuminator flavus
Textmarker grün§Highlighter green§Surligneur vert§荧光笔 绿§Текстовыделитель зелёный§हाइलाइटर हरा§Illuminator viridis
Textmarker rosa§Highlighter pink§Surligneur rose§荧光笔 粉§Текстовыделитель розовый§हाइलाइटर गुलाबी§Illuminator roseus
Ein interner Fehler ist aufgetreten. Ihr Board wurde vorsorglich gespeichert.§An internal error occurred. Your board has been saved as a precaution.§Une erreur interne s’est produite. Votre tableau a été enregistré par précaution.§发生内部错误。已预先保存您的白板。§Произошла внутренняя ошибка. Доска сохранена на всякий случай.§एक आंतरिक त्रुटि हुई। सावधानी के लिए आपका बोर्ड सहेज लिया गया।§Error internus accidit. Tabula tua cautionis causa servata est.
Hell§Light§Clair§浅色§Светлая§हल्का§Clarum
Dunkel§Dark§Sombre§深色§Тёмная§गहरा§Obscurum
System§System§Système§跟随系统§Системная§सिस्टम§Systema
Fein§Fine§Fin§细§Тонкая§बारीक§Tenue
Mittel§Medium§Moyen§中§Средняя§मध्यम§Medium
Grob§Coarse§Gros§粗§Крупная§मोटा§Crassum
Einstellung suchen …§Search settings …§Rechercher un réglage …§搜索设置 …§Поиск настройки …§सेटिंग खोजें …§Optionem quaerere …
Darstellung§Appearance§Affichage§外观§Оформление§रूप§Species
App-Symbol§App icon§Icône de l’app§应用图标§Значок приложения§ऐप आइकन§Icon applicationis
Gilt sofort für Tab und Startbildschirm. Für die installierte App muss Scriptoria aus Edge neu installiert werden (siehe ⓘ Hilfe → Ansicht).§Applies immediately to the tab and start screen. For the installed app, reinstall Scriptoria from Edge (see ⓘ Help → View).§S’applique tout de suite à l’onglet et à l’écran d’accueil. Pour l’app installée, réinstallez Scriptoria depuis Edge (voir ⓘ Aide → Affichage).§立即应用于标签页和开始屏幕。已安装的应用需从 Edge 重新安装 Scriptoria（见 ⓘ 帮助 → 视图）。§Сразу действует для вкладки и стартового экрана. Для установленного приложения переустановите Scriptoria из Edge (см. ⓘ Справка → Вид).§टैब और प्रारंभ स्क्रीन पर तुरंत लागू। इंस्टॉल ऐप के लिए Scriptoria को Edge से फिर से इंस्टॉल करें (ⓘ सहायता → दृश्य देखें)।§Statim in pagina et in initio valet. Pro applicatione installata Scriptoria ex Edge iterum installa (vide ⓘ Auxilium → Aspectus).
Hilfetexte anzeigen§Show help texts§Afficher les textes d’aide§显示帮助文字§Показывать подсказки§सहायता पाठ दिखाएँ§Textus auxilii monstrare
Kurze Hinweise in der rechten Leiste und in Meldungen.§Short hints in the right panel and in messages.§Brèves indications dans le panneau de droite et les messages.§右侧面板和提示消息中的简短说明。§Короткие подсказки на правой панели и в сообщениях.§दाएँ पैनल और संदेशों में छोटे संकेत।§Breves notae in tabella dextra et in nuntiis.
Hilfslinien§Guide lines§Repères§辅助线§Вспомогательные линии§सहायक रेखाएँ§Lineae auxiliares
Hilfslinien anzeigen§Show guide lines§Afficher les repères§显示辅助线§Показывать вспомогательные линии§सहायक रेखाएँ दिखाएँ§Lineas auxiliares monstrare
Punkte§Dots§Points§点§Точки§बिंदु§Puncta
Karos§Squares§Carreaux§方格§Клетки§वर्ग§Quadrata
Linien§Lines§Lignes§横线§Линии§रेखाएँ§Lineae
Stärke§Strength§Intensité§粗细§Насыщенность§गहराई§Robur
Kräftig§Strong§Marqué§粗§Яркие§गहरा§Validum
Rastergröße§Grid size§Taille de la grille§网格大小§Размер сетки§ग्रिड आकार§Magnitudo cancelli
Am Raster einrasten§Snap to grid§Aligner sur la grille§吸附到网格§Привязка к сетке§ग्रिड पर चिपकाएँ§Ad cancellos adhaerere
Linien, Formen und Bauteile rasten ein.§Lines, shapes and components snap to the grid.§Lignes, formes et composants s’alignent.§线条、形状和元件吸附到网格。§Линии, фигуры и детали привязываются к сетке.§रेखाएँ, आकृतियाँ और घटक ग्रिड पर चिपकते हैं।§Lineae, figurae et partes ad cancellos adhaerent.
Schreiben§Writing§Écriture§书写§Письмо§लेखन§Scriptura
Druckempfindlicher Stift§Pressure-sensitive pen§Stylet sensible à la pression§压感笔§Чувствительность к нажиму§दबाव-संवेदी पेन§Stilus pressioni sensibilis
Mit Grafiktablett oder Surface-Stift wird der Strich dicker, je fester man drückt.§With a graphics tablet or Surface pen, the stroke gets thicker the harder you press.§Avec une tablette graphique ou un stylet Surface, le trait s’épaissit selon la pression.§使用数位板或 Surface 笔时，按压越重笔画越粗。§С графическим планшетом или пером Surface линия толще при сильном нажиме.§ग्राफ़िक्स टैबलेट या Surface पेन से जितना ज़ोर, उतनी मोटी रेखा।§Cum tabula graphica vel stilo Surface linea crassior fit quo fortius premis.
Formen erkennen§Recognise shapes§Reconnaître les formes§识别形状§Распознавать фигуры§आकृतियाँ पहचानें§Figuras agnoscere
Stift am Ende kurz stillhalten: Linie, Kreis, Ellipse, Rechteck oder Dreieck wird sauber gezogen.§Hold the pen still briefly at the end: line, circle, ellipse, rectangle or triangle is drawn cleanly.§Gardez le stylet immobile un instant à la fin : ligne, cercle, ellipse, rectangle ou triangle est tracé proprement.§笔画末尾稍作停顿：直线、圆、椭圆、矩形或三角形会被规整绘制。§Задержите перо в конце: линия, круг, эллипс, прямоугольник или треугольник станет ровным.§अंत में पेन थोड़ा रोकें: रेखा, वृत्त, दीर्घवृत्त, आयत या त्रिभुज साफ़ बनता है।§Stilum in fine paulisper tene: linea, circulus, ellipsis, rectangulum vel triangulum pure ducitur.
Fragen§Ask§Demander§询问§Спрашивать§पूछें§Rogare
Untereinander§Stacked§Empilées§纵向排列§Друг под другом§एक के नीचे एक§Sub se invicem
Je Seite§Per page§Par page§每页§По странице§प्रति पृष्ठ§Per paginam
PDF-Seiten nebeneinander§PDF pages side by side§Pages PDF côte à côte§PDF 页并排数§Страниц PDF в ряд§साथ-साथ PDF पृष्ठ§Paginae PDF iuxta
Werkzeuge in der Leiste§Tools in the toolbar§Outils dans la barre§工具栏中的工具§Инструменты на панели§टूलबार में उपकरण§Instrumenta in tabella
Lineal§Ruler§Règle§直尺§Линейка§रूलर§Regula
Geodreieck§Set square§Équerre§三角尺§Угольник§सेट स्क्वेयर§Norma
Zirkel§Compass§Compas§圆规§Циркуль§परकार§Circinus
Parabel§Parabola§Parabole§抛物线§Парабола§परवलय§Parabola
Laserpointer§Laser pointer§Pointeur laser§激光笔§Лазерная указка§लेज़र पॉइंटर§Index laser
Funktionsplotter & Koordinatensystem§Function plotter & coordinate system§Traceur de fonctions & repère§函数绘图与坐标系§Построитель графиков и система координат§फ़ंक्शन प्लॉटर व निर्देशांक तंत्र§Delineator functionum & systema coordinatarum
Zeigerdiagramm§Phasor diagram§Diagramme de Fresnel§相量图§Векторная диаграмма§फ़ेज़र आरेख§Diagramma phasorum
Diagramm-Vorlagen§Diagram templates§Modèles de diagrammes§图表模板§Шаблоны диаграмм§आरेख नमूने§Exemplaria diagrammatum
Bode-Diagramm, Oszilloskop-Raster, Kennlinienfeld …§Bode plot, oscilloscope grid, characteristic curves …§Diagramme de Bode, grille d’oscilloscope, réseau de caractéristiques …§波特图、示波器网格、特性曲线 …§Диаграмма Боде, сетка осциллографа, характеристики …§बोड आरेख, ऑसिलोस्कोप ग्रिड, अभिलक्षण वक्र …§Diagramma Bode, cancelli oscilloscopii, curvae proprietatum …
Stoppuhr§Stopwatch§Chronomètre§秒表§Секундомер§स्टॉपवॉच§Horologium cursorium
Fourier-Reihe einer Funktion: Frequenzen, Amplituden und Phasen.§Fourier series of a function: frequencies, amplitudes and phases.§Série de Fourier d’une fonction : fréquences, amplitudes et phases.§函数的傅里叶级数：频率、幅度和相位。§Ряд Фурье функции: частоты, амплитуды и фазы.§किसी फ़ंक्शन की फ़ूरिये श्रेणी: आवृत्तियाँ, आयाम और कलाएँ।§Series Fourier functionis: frequentiae, amplitudines, phases.
Wissenschaftlicher Taschenrechner§Scientific calculator§Calculatrice scientifique§科学计算器§Инженерный калькулятор§वैज्ञानिक कैलकुलेटर§Calculatrum scientificum
Elektronik§Electronics§Électronique§电子§Электроника§इलेक्ट्रॉनिक्स§Electronica
Elektronik-Baukasten§Electronics kit§Boîte à électronique§电子元件箱§Конструктор электроники§इलेक्ट्रॉनिक्स किट§Arcula electronica
Bauteile, Schaltungen und Leitungswerkzeug.§Components, circuits and wiring tool.§Composants, circuits et outil de câblage.§元件、电路与连线工具。§Детали, схемы и инструмент проводов.§घटक, परिपथ और तार उपकरण।§Partes, circuitus et instrumentum filorum.
Erweiterte Bauteile simulieren§Simulate advanced components§Simuler les composants avancés§仿真高级元件§Моделировать расширенные детали§उन्नत घटकों का अनुकरण§Partes provectas simulare
Immer§Always§Toujours§总是§Всегда§हमेशा§Semper
Nie§Never§Jamais§从不§Никогда§कभी नहीं§Numquam
Thyristor, TRIAC, MOSFET, JFET, Transformator, Flipflops u. a. werden mit vereinfachten Modellen berechnet.§Thyristor, TRIAC, MOSFET, JFET, transformer, flip-flops etc. are computed with simplified models.§Thyristor, TRIAC, MOSFET, JFET, transformateur, bascules etc. sont calculés avec des modèles simplifiés.§晶闸管、TRIAC、MOSFET、JFET、变压器、触发器等使用简化模型计算。§Тиристор, симистор, MOSFET, JFET, трансформатор, триггеры и др. рассчитываются по упрощённым моделям.§थाइरिस्टर, TRIAC, MOSFET, JFET, ट्रांसफ़ॉर्मर, फ़्लिप-फ़्लॉप आदि सरल मॉडलों से गणना होते हैं।§Thyristor, TRIAC, MOSFET, JFET, transformator, flip-flop etc. exemplaribus simplicibus computantur.
Historische Tafeln§Historical boards§Tableaux historiques§历史书写板§Исторические доски§ऐतिहासिक पट्टिकाएँ§Tabulae historicae
Historische Vorlagen§Historical templates§Modèles historiques§历史模板§Исторические шаблоны§ऐतिहासिक नमूने§Exemplaria historica
Kreidetafel, Papyrus, Wachstafel, Sandtafel, Tontafel, Schiefertafel und Pergament anbieten.§Offer chalkboard, papyrus, wax tablet, sand table, clay tablet, slate and parchment.§Proposer tableau noir, papyrus, tablette de cire, table de sable, tablette d’argile, ardoise et parchemin.§提供黑板、纸莎草纸、蜡板、沙盘、泥板、石板和羊皮纸。§Предлагать меловую доску, папирус, восковую, песочную, глиняную, грифельную доски и пергамент.§चॉकबोर्ड, पपाइरस, मोम, रेत, मिट्टी की पट्टिका, स्लेट और चर्मपत्र उपलब्ध कराएँ।§Tabulam cretaceam, papyrum, tabulam ceratam, abacum, tabulam fictilem, saxeam et membranam offerre.
Nur historische Werkzeuge§Historical tools only§Outils historiques uniquement§仅历史工具§Только исторические инструменты§केवल ऐतिहासिक उपकरण§Instrumenta historica tantum
Moderne Werkzeuge auf historischen Tafeln ausblenden.§Hide modern tools on historical boards.§Masquer les outils modernes sur les tableaux historiques.§在历史书写板上隐藏现代工具。§Скрывать современные инструменты на исторических досках.§ऐतिहासिक पट्टिकाओं पर आधुनिक उपकरण छिपाएँ।§Instrumenta moderna in tabulis historicis celare.
Lineal-Kalibrierung (1:1)§Ruler calibration (1:1)§Calibrage de la règle (1:1)§直尺校准 (1:1)§Калибровка линейки (1:1)§रूलर अंशांकन (1:1)§Regulae aequatio (1:1)
Der blaue Balken soll genau 10 cm lang sein. Mit einem echten Lineal nachmessen und den Wert eintragen.§The blue bar should be exactly 10 cm long. Measure it with a real ruler and enter the value.§La barre bleue doit mesurer exactement 10 cm. Mesurez-la avec une vraie règle et saisissez la valeur.§蓝色条应正好 10 厘米长。用真实直尺测量并输入数值。§Синяя полоса должна быть ровно 10 см. Измерьте настоящей линейкой и введите значение.§नीली पट्टी ठीक 10 सेमी होनी चाहिए। असली रूलर से नापकर मान डालें।§Virga caerulea 10 cm longa esse debet. Regula vera metire et valorem inscribe.
cm gemessen§cm measured§cm mesurés§厘米（实测）§см измерено§सेमी मापा§cm mensa
Lineal kalibriert.§Ruler calibrated.§Règle calibrée.§直尺已校准。§Линейка откалибрована.§रूलर अंशांकित।§Regula aequata.
Übernehmen§Apply§Appliquer§应用§Применить§लागू करें§Adhibere
Zurücksetzen§Reset§Réinitialiser§重置§Сбросить§रीसेट§Restituere
Einstellungen§Settings§Réglages§设置§Настройки§सेटिंग्स§Optiones
Fertig§Done§Terminé§完成§Готово§हो गया§Factum
Anleitung: Elektronik-Baukasten§Guide: electronics kit§Guide : boîte à électronique§指南：电子元件箱§Руководство: конструктор электроники§मार्गदर्शिका: इलेक्ट्रॉनिक्स किट§Ductus: arcula electronica
An den Inhalt angepasst (eine Seite)§Fit to content (one page)§Ajusté au contenu (une page)§适应内容（单页）§По содержимому (одна страница)§सामग्री अनुसार (एक पृष्ठ)§Ad contentum aptatum (una pagina)
A4 quer§A4 landscape§A4 paysage§A4 横向§A4 альбомная§A4 क्षैतिज§A4 transversum
A4 hoch§A4 portrait§A4 portrait§A4 纵向§A4 книжная§A4 लंबवत§A4 erectum
Als PDF exportieren§Export as PDF§Exporter en PDF§导出为 PDF§Экспорт в PDF§PDF के रूप में निर्यात§Ut PDF exportare
Seitenformat§Page format§Format de page§页面格式§Формат страницы§पृष्ठ प्रारूप§Forma paginae
Alle Seiten (je Seite eine PDF-Seite)§All pages (one PDF page each)§Toutes les pages (une page PDF chacune)§所有页（每页一个 PDF 页）§Все страницы (каждая — страница PDF)§सभी पृष्ठ (प्रत्येक एक PDF पृष्ठ)§Omnes paginae (singulae paginae PDF)
Nur die Auswahl exportieren§Export selection only§Exporter la sélection uniquement§仅导出所选内容§Экспортировать только выделенное§केवल चयन निर्यात करें§Solum electa exportare
Exportieren§Export§Exporter§导出§Экспорт§निर्यात§Exportare
Scriptoria – Funktionen & Hilfe§Scriptoria – features & help§Scriptoria – fonctions & aide§Scriptoria – 功能与帮助§Scriptoria – функции и справка§Scriptoria – सुविधाएँ व सहायता§Scriptoria – functiones & auxilium
In der Hilfe suchen …§Search help …§Rechercher dans l’aide …§搜索帮助 …§Поиск в справке …§सहायता में खोजें …§In auxilio quaerere …
Standard (Segoe UI)§Default (Segoe UI)§Standard (Segoe UI)§默认 (Segoe UI)§Стандарт (Segoe UI)§मानक (Segoe UI)§Praefinitum (Segoe UI)
Consolas (Festbreite)§Consolas (monospace)§Consolas (chasse fixe)§Consolas（等宽）§Consolas (моноширинный)§Consolas (मोनोस्पेस)§Consolas (latitudo fixa)
Handschrift (Segoe Print)§Handwriting (Segoe Print)§Manuscrite (Segoe Print)§手写体 (Segoe Print)§Рукописный (Segoe Print)§हस्तलिपि (Segoe Print)§Manu scripta (Segoe Print)
Achse§Axis§Axe§轴§Ось§अक्ष§Axis
Senkrecht§Vertical§Verticale§竖直§Вертикальная§ऊर्ध्वाधर§Perpendicularis
Waagerecht§Horizontal§Horizontale§水平§Горизонтальная§क्षैतिज§Horizontalis
Am Scheitel ansetzen und zum Kurvenpunkt ziehen. Umschalt wechselt die Achse.§Start at the vertex and drag to a point on the curve. Shift switches the axis.§Partez du sommet et tirez jusqu’à un point de la courbe. Maj change l’axe.§从顶点开始拖到曲线上一点。Shift 切换轴向。§Начните в вершине и тяните к точке кривой. Shift меняет ось.§शीर्ष से शुरू करके वक्र के बिंदु तक खींचें। Shift अक्ष बदलता है।§A vertice incipe et ad punctum curvae trahe. Shift axem mutat.
Am Anschluss klicken, Eckpunkte setzen. Endet an Anschluss oder Leitung. Esc beendet.§Click a terminal, set corner points. Ends at a terminal or wire. Esc finishes.§Cliquez sur une borne, placez les coins. Se termine sur une borne ou un fil. Échap termine.§点击端子，设置拐点。在端子或导线处结束。Esc 结束。§Щёлкните по выводу, ставьте углы. Заканчивается на выводе или проводе. Esc — завершить.§टर्मिनल पर क्लिक करें, कोने बनाएँ। टर्मिनल या तार पर समाप्त। Esc समाप्त।§Terminum preme, angulos pone. In termino vel filo desinit. Esc finit.
Formeln§Formulas§Formules§公式§Формулы§सूत्र§Formulae
Blauer Knopf dreht. An einer Kante zeichnen ergibt gerade Linien.§Blue knob rotates. Drawing along an edge gives straight lines.§Le bouton bleu fait pivoter. Tracer le long d’un bord donne des droites.§蓝色旋钮旋转。沿边缘绘制得到直线。§Синяя кнопка вращает. Рисование вдоль края даёт прямые линии.§नीला बटन घुमाता है। किनारे से खींचने पर सीधी रेखा बनती है।§Globulus caeruleus vertit. Ad marginem ducens lineas rectas facis.
Formel-Darstellung konnte nicht geladen werden.§Formula rendering could not be loaded.§Impossible de charger l’affichage des formules.§无法加载公式渲染。§Не удалось загрузить отображение формул.§सूत्र प्रदर्शन लोड नहीं हो सका।§Formularum species aperiri non potuit.
Schulzimmer, 19./20. Jh.§Classroom, 19th/20th c.§Salle de classe, XIXe/XXe s.§教室，19/20 世纪§Класс, XIX–XX вв.§कक्षा, 19वीं/20वीं सदी§Schola, saec. XIX/XX
Grüne Schultafel mit Kreide in sechs Farben und Schwamm.§Green school board with chalk in six colours and a sponge.§Tableau vert avec craie de six couleurs et éponge.§绿色黑板，配六色粉笔和板擦。§Зелёная школьная доска, мел шести цветов и губка.§छह रंगों की चॉक और स्पंज के साथ हरा श्यामपट।§Tabula viridis cum creta sex colorum et spongia.
Kreide weiß§Chalk white§Craie blanche§白色粉笔§Мел белый§सफ़ेद चॉक§Creta alba
Kreide gelb§Chalk yellow§Craie jaune§黄色粉笔§Мел жёлтый§पीली चॉक§Creta flava
Kreide rosa§Chalk pink§Craie rose§粉色粉笔§Мел розовый§गुलाबी चॉक§Creta rosea
Kreide blau§Chalk blue§Craie bleue§蓝色粉笔§Мел синий§नीली चॉक§Creta caerulea
Kreide grün§Chalk green§Craie verte§绿色粉笔§Мел зелёный§हरी चॉक§Creta viridis
Kreide orange§Chalk orange§Craie orange§橙色粉笔§Мел оранжевый§नारंगी चॉक§Creta aurantia
Schwamm§Sponge§Éponge§板擦§Губка§स्पंज§Spongia
Tafellineal (U)§Board ruler (U)§Règle de tableau (U)§黑板直尺 (U)§Линейка для доски (U)§बोर्ड रूलर (U)§Regula tabulae (U)
Tafeldreieck (G)§Board set square (G)§Équerre de tableau (G)§黑板三角尺 (G)§Угольник для доски (G)§बोर्ड सेट स्क्वेयर (G)§Norma tabulae (G)
Tafelzirkel (C)§Board compass (C)§Compas de tableau (C)§黑板圆规 (C)§Циркуль для доски (C)§बोर्ड परकार (C)§Circinus tabulae (C)
Zeigestock (J)§Pointer stick (J)§Baguette (J)§教鞭 (J)§Указка (J)§संकेतक छड़ी (J)§Radius (J)
Papyrusrolle§Papyrus scroll§Rouleau de papyrus§纸莎草卷§Папирусный свиток§पपाइरस पांडुलिपि§Volumen papyraceum
Altes Ägypten, ab ca. 3000 v. Chr.§Ancient Egypt, from c. 3000 BC§Égypte ancienne, dès env. 3000 av. J.-C.§古埃及，约公元前 3000 年起§Древний Египет, с ок. 3000 г. до н. э.§प्राचीन मिस्र, लगभग 3000 ई.पू. से§Aegyptus antiqua, ab a. 3000 a. Chr. n.
Schriftrolle aus Papyrus, beschrieben mit Binsenpinsel in Ruß-Schwarz und Ocker-Rot.§Papyrus scroll, written with a rush brush in soot black and ochre red.§Rouleau de papyrus écrit au pinceau de jonc, noir de suie et rouge ocre.§纸莎草卷轴，用灯芯草笔以烟黑和赭红书写。§Папирусный свиток, написанный кисточкой из тростника сажей и красной охрой.§पपाइरस की पांडुलिपि, सरकंडे की कूची से कालिख-काले और गेरुए-लाल में लिखी।§Volumen papyraceum, penicillo iunceo fuligine nigra et ochra rubra scriptum.
Binse – Ruß (schwarz)§Rush brush – soot (black)§Jonc – suie (noir)§灯芯草笔 – 烟黑§Тростник – сажа (чёрный)§सरकंडा – कालिख (काला)§Iuncus – fuligo (niger)
Binse – Ocker (rot)§Rush brush – ochre (red)§Jonc – ocre (rouge)§灯芯草笔 – 赭红§Тростник – охра (красный)§सरकंडा – गेरू (लाल)§Iuncus – ochra (ruber)
Feuchtes Tuch§Damp cloth§Chiffon humide§湿布§Влажная ткань§गीला कपड़ा§Linteum umidum
Richtschnur (U)§Guide cord (U)§Cordeau (U)§准绳 (U)§Шнур (U)§सूत (U)§Linea (U)
Messschnur für Kreise (C)§Cord for circles (C)§Cordeau pour cercles (C)§画圆绳 (C)§Шнур для кругов (C)§वृत्त के लिए सूत (C)§Funiculus circulorum (C)
Zeigestab (J)§Pointer (J)§Baguette (J)§指示棒 (J)§Указка (J)§संकेतक (J)§Radius (J)
Römische Wachstafel§Roman wax tablet§Tablette de cire romaine§罗马蜡板§Римская восковая табличка§रोमन मोम पट्टिका§Tabula cerata Romana
Römisches Reich§Roman Empire§Empire romain§罗马帝国§Римская империя§रोमन साम्राज्य§Imperium Romanum
Gebundene Wachstafeln (Polyptychon) aus Holz. Mit der Spitze des Stilus schreiben, mit dem flachen Ende glätten – Taste D dreht den Stilus.§Bound wooden wax tablets (polyptych). Write with the stylus tip, smooth with the flat end – key D turns the stylus.§Tablettes de cire reliées (polyptyque) en bois. Écrire avec la pointe du stylet, lisser avec le bout plat – la touche D tourne le stylet.§装订的木质蜡板（多联板）。用尖笔尖端书写，用平头抹平——按 D 翻转尖笔。§Связанные деревянные восковые таблички (полиптих). Пишите острием стилуса, разглаживайте плоским концом — клавиша D поворачивает стилус.§बंधी लकड़ी की मोम पट्टिकाएँ। स्टाइलस की नोक से लिखें, चपटे सिरे से समतल करें – D कुंजी स्टाइलस घुमाती है।§Tabulae ceratae ligneae coniunctae (polyptychum). Cuspide stili scribe, parte plana leva – littera D stilum vertit.
Stilus – Spitze zum Schreiben (D dreht)§Stylus – tip for writing (D turns)§Stylet – pointe pour écrire (D tourne)§尖笔 – 尖端书写（D 翻转）§Стилус – остриё для письма (D — поворот)§स्टाइलस – लिखने की नोक (D घुमाए)§Stilus – cuspis ad scribendum (D vertit)
Stilus – flaches Ende zum Glätten (D dreht)§Stylus – flat end for smoothing (D turns)§Stylet – bout plat pour lisser (D tourne)§尖笔 – 平头抹平（D 翻转）§Стилус – плоский конец для разглаживания (D — поворот)§स्टाइलस – समतल करने का चपटा सिरा (D घुमाए)§Stilus – pars plana ad levandum (D vertit)
Regula – Lineal (U)§Regula – ruler (U)§Regula – règle (U)§Regula – 直尺 (U)§Regula – линейка (U)§Regula – रूलर (U)§Regula (U)
Circinus – Zirkel (C)§Circinus – compass (C)§Circinus – compas (C)§Circinus – 圆规 (C)§Circinus – циркуль (C)§Circinus – परकार (C)§Circinus (C)
Archimedes’ Sandtafel§Archimedes’ sand table§Table de sable d’Archimède§阿基米德沙盘§Песочная доска Архимеда§आर्किमिडीज़ की रेत पट्टिका§Abacus Archimedis
Antikes Griechenland, 3. Jh. v. Chr.§Ancient Greece, 3rd c. BC§Grèce antique, IIIe s. av. J.-C.§古希腊，公元前 3 世纪§Древняя Греция, III в. до н. э.§प्राचीन यूनान, तीसरी सदी ई.पू.§Graecia antiqua, saec. III a. Chr. n.
Mit einem Stab Figuren in feinen Sand zeichnen – wie Archimedes. Mit der Hand glattstreichen.§Draw figures in fine sand with a stick – like Archimedes. Smooth with your hand.§Tracer des figures dans le sable fin avec un bâton – comme Archimède. Lisser à la main.§像阿基米德一样用木棒在细沙上画图，用手抹平。§Рисуйте палочкой фигуры на мелком песке — как Архимед. Разглаживайте рукой.§आर्किमिडीज़ की तरह छड़ी से बारीक रेत में आकृतियाँ बनाएँ। हाथ से समतल करें।§Radio figuras in harena tenui describe – ut Archimedes. Manu leva.
Zeichenstab§Drawing stick§Bâton à dessiner§画棒§Палочка§रेखन छड़ी§Radius
Stab (dick)§Stick (thick)§Bâton (épais)§粗棒§Палка (толстая)§छड़ी (मोटी)§Baculum (crassum)
Hand (glattstreichen)§Hand (smooth)§Main (lisser)§手（抹平）§Рука (разгладить)§हाथ (समतल करें)§Manus (levare)
Lineal (U)§Ruler (U)§Règle (U)§直尺 (U)§Линейка (U)§रूलर (U)§Regula (U)
Zirkel (C)§Compass (C)§Compas (C)§圆规 (C)§Циркуль (C)§परकार (C)§Circinus (C)
Mesopotamische Tontafel§Mesopotamian clay tablet§Tablette d’argile mésopotamienne§美索不达米亚泥板§Месопотамская глиняная табличка§मेसोपोटामियाई मिट्टी की पट्टिका§Tabula fictilis Mesopotamica
Mesopotamien, ab ca. 3300 v. Chr.§Mesopotamia, from c. 3300 BC§Mésopotamie, dès env. 3300 av. J.-C.§美索不达米亚，约公元前 3300 年起§Месопотамия, с ок. 3300 г. до н. э.§मेसोपोटामिया, लगभग 3300 ई.पू. से§Mesopotamia, ab a. 3300 a. Chr. n.
Weicher Ton. Das Schreibrohr drückt Keile ein (ziehen gibt Richtung und Länge), der Griffel ritzt Linien. Mit dem Daumen glätten.§Soft clay. The reed presses wedges (dragging sets direction and length), the stylus scratches lines. Smooth with your thumb.§Argile molle. Le calame imprime des coins (tirer donne direction et longueur), le stylet trace des lignes. Lisser avec le pouce.§软泥。芦苇笔压出楔形（拖动决定方向与长度），刻笔划线。用拇指抹平。§Мягкая глина. Тростник выдавливает клинья (протягивание задаёт направление и длину), стило царапает линии. Разглаживайте большим пальцем.§नरम मिट्टी। सरकंडा कीलें दबाता है (खींचने से दिशा व लंबाई), कलम रेखाएँ खरोंचती है। अंगूठे से समतल करें।§Lutum molle. Calamus cuneos imprimit (tractus directionem et longitudinem dat), stilus lineas incidit. Pollice leva.
Schreibrohr (Keil eindrücken)§Reed (press wedge)§Calame (imprimer un coin)§芦苇笔（压楔）§Тростник (вдавить клин)§सरकंडा (कील दबाएँ)§Calamus (cuneum imprimere)
Griffel (ritzen)§Stylus (scratch)§Stylet (graver)§刻笔（划刻）§Стило (царапать)§कलम (खरोंचें)§Stilus (incidere)
Daumen (glätten)§Thumb (smooth)§Pouce (lisser)§拇指（抹平）§Палец (разгладить)§अंगूठा (समतल करें)§Pollex (levare)
Schilfrohr als Lineal (U)§Reed as ruler (U)§Roseau comme règle (U)§芦苇直尺 (U)§Тростник как линейка (U)§सरकंडा रूलर के रूप में (U)§Harundo pro regula (U)
Schule, 19. Jh.§School, 19th c.§École, XIXe s.§学校，19 世纪§Школа, XIX в.§विद्यालय, 19वीं सदी§Schola, saec. XIX
Schiefertafel im Holzrahmen mit Schreiblinien, Griffel, Kreide, Schwamm und Läppchen.§Slate in a wooden frame with ruled lines, slate pencil, chalk, sponge and cloth.§Ardoise à cadre en bois avec lignes, crayon d’ardoise, craie, éponge et chiffon.§木框石板，带书写线、石笔、粉笔、海绵和抹布。§Грифельная доска в деревянной рамке с линовкой, грифелем, мелом, губкой и тряпочкой.§लकड़ी के फ़्रेम में रेखांकित स्लेट, बत्ती, चॉक, स्पंज और कपड़ा।§Tabula saxea in forma lignea cum lineis, stilo, creta, spongia et panniculo.
Griffel§Slate pencil§Crayon d’ardoise§石笔§Грифель§स्लेट बत्ती§Stilus
Kreide§Chalk§Craie§粉笔§Мел§चॉक§Creta
Läppchen§Cloth§Chiffon§抹布§Тряпочка§कपड़ा§Panniculus
Pergament mit Gänsekiel§Parchment with quill§Parchemin et plume d’oie§羊皮纸与鹅毛笔§Пергамент и гусиное перо§चर्मपत्र और हंस-पंख कलम§Membrana cum penna anserina
Mittelalterliches Skriptorium§Medieval scriptorium§Scriptorium médiéval§中世纪缮写室§Средневековый скрипторий§मध्यकालीन लिपिशाला§Scriptorium mediaevale
Pergament mit Gänsekiel in Eisengallustinte, Zinnoberrot und Azuritblau. Fehler werden mit dem Federmesser abgeschabt.§Parchment with a quill in iron gall ink, vermilion and azurite blue. Mistakes are scraped off with the penknife.§Parchemin à la plume d’oie, encre ferro-gallique, vermillon et bleu azurite. Les erreurs sont grattées au canif.§羊皮纸，鹅毛笔蘸铁胆墨水、朱红和石青。错误用削笔刀刮掉。§Пергамент, гусиное перо, железо-галловые чернила, киноварь и азурит. Ошибки соскабливают перочинным ножом.§चर्मपत्र पर हंस-पंख कलम से लौह-गॉल स्याही, सिंदूरी लाल और अज़ुराइट नीला। गलतियाँ चाकू से खुरची जाती हैं।§Membrana cum penna anserina, atramento gallico, minio et caeruleo azurite. Errata scalpello raduntur.
Gänsekiel – Eisengallustinte§Quill – iron gall ink§Plume – encre ferro-gallique§鹅毛笔 – 铁胆墨水§Перо – железо-галловые чернила§हंस-पंख – लौह-गॉल स्याही§Penna – atramentum gallicum
Gänsekiel – Zinnoberrot§Quill – vermilion§Plume – vermillon§鹅毛笔 – 朱红§Перо – киноварь§हंस-पंख – सिंदूरी§Penna – minium
Gänsekiel – Azuritblau§Quill – azurite blue§Plume – bleu azurite§鹅毛笔 – 石青§Перо – азурит§हंस-पंख – अज़ुराइट नीला§Penna – caeruleum
Bleigriffel (Linien vorziehen)§Lead point (rule lines)§Mine de plomb (tracer des lignes)§铅笔（预画线）§Свинцовый карандаш (разлиновка)§सीसे की कलम (रेखाएँ खींचें)§Plumbum (lineas ducere)
Federmesser (abschaben)§Penknife (scrape off)§Canif (gratter)§削笔刀（刮除）§Перочинный нож (соскоблить)§कलमतराश (खुरचें)§Scalpellum (radere)
Stilus gedreht: flaches Ende zum Glätten.§Stylus turned: flat end for smoothing.§Stylet tourné : bout plat pour lisser.§尖笔已翻转：平头抹平。§Стилус повёрнут: плоский конец для разглаживания.§स्टाइलस घुमाया: समतल करने का चपटा सिरा।§Stilus versus: pars plana ad levandum.
Stilus gedreht: Spitze zum Schreiben.§Stylus turned: tip for writing.§Stylet tourné : pointe pour écrire.§尖笔已翻转：尖端书写。§Стилус повёрнут: остриё для письма.§स्टाइलस घुमाया: लिखने की नोक।§Stilus versus: cuspis ad scribendum.
Modernes Whiteboard§Modern whiteboard§Tableau blanc moderne§现代白板§Современная доска§आधुनिक व्हाइटबोर्ड§Tabula alba moderna
Seite löschen§Delete page§Supprimer la page§删除页面§Удалить страницу§पृष्ठ हटाएँ§Paginam delere
Vorherige Seite (Bild ↑)§Previous page (Page ↑)§Page précédente (Pg ↑)§上一页 (Page ↑)§Предыдущая страница (PgUp)§पिछला पृष्ठ (Page ↑)§Pagina prior (Page ↑)
Seitenmenü§Page menu§Menu de la page§页面菜单§Меню страницы§पृष्ठ मेनू§Index paginae
Neue Seite danach§New page after§Nouvelle page après§在后面新建页面§Новая страница после§बाद में नया पृष्ठ§Nova pagina post
Seite nach vorne§Move page forward§Avancer la page§页面前移§Страницу вперёд§पृष्ठ आगे करें§Paginam antea movere
Seite nach hinten§Move page back§Reculer la page§页面后移§Страницу назад§पृष्ठ पीछे करें§Paginam postea movere
Seite löschen …§Delete page …§Supprimer la page …§删除页面 …§Удалить страницу …§पृष्ठ हटाएँ …§Paginam delere …
Nächste Seite (Bild ↓)§Next page (Page ↓)§Page suivante (Pg ↓)§下一页 (Page ↓)§Следующая страница (PgDn)§अगला पृष्ठ (Page ↓)§Pagina proxima (Page ↓)
Neue Seite§New page§Nouvelle page§新建页面§Новая страница§नया पृष्ठ§Nova pagina
Scriptoria wurde installiert.§Scriptoria has been installed.§Scriptoria a été installé.§Scriptoria 已安装。§Scriptoria установлена.§Scriptoria इंस्टॉल हो गया।§Scriptoria installata est.
Erweiterte Bauteile§Advanced components§Composants avancés§高级元件§Расширенные детали§उन्नत घटक§Partes provectae
Die Ergebnisse zeigen das typische Verhalten, sind aber keine genaue Bauteilsimulation.§The results show the typical behaviour but are not an exact component simulation.§Les résultats montrent le comportement typique, sans être une simulation exacte des composants.§结果显示典型行为，但不是精确的元件仿真。§Результаты показывают типичное поведение, но не являются точной моделью деталей.§परिणाम सामान्य व्यवहार दिखाते हैं, पर सटीक घटक अनुकरण नहीं हैं।§Exitus mores typicos ostendunt, non tamen accuratam partium simulationem.
Nicht mehr fragen (in den Einstellungen änderbar)§Don’t ask again (can be changed in settings)§Ne plus demander (modifiable dans les réglages)§不再询问（可在设置中更改）§Больше не спрашивать (можно изменить в настройках)§फिर न पूछें (सेटिंग्स में बदल सकते हैं)§Noli iterum rogare (in optionibus mutabile)
Ohne diese Bauteile§Without these components§Sans ces composants§不含这些元件§Без этих деталей§इन घटकों के बिना§Sine his partibus
Mitsimulieren§Include in simulation§Les simuler aussi§一并仿真§Моделировать их тоже§अनुकरण में शामिल करें§Una simulare
Keine simulierbare Schaltung gefunden. Bauteile mit Leitungen verbinden (Taste W).§No circuit to simulate found. Connect components with wires (key W).§Aucun circuit simulable trouvé. Reliez les composants par des fils (touche W).§未找到可仿真的电路。请用导线连接元件（W 键）。§Схема для моделирования не найдена. Соедините детали проводами (клавиша W).§अनुकरण योग्य परिपथ नहीं मिला। घटकों को तारों से जोड़ें (W कुंजी)।§Nullus circuitus simulandus inventus. Partes filis coniunge (littera W).
/ Teil§/ div§/ div§/ 格§/ дел§/ खंड§/ pars
⏸ Pause§⏸ Pause§⏸ Pause§⏸ 暂停§⏸ Пауза§⏸ रोकें§⏸ Pausa
▶ Weiter§▶ Resume§▶ Reprendre§▶ 继续§▶ Продолжить§▶ जारी रखें§▶ Pergere
Zurücksetzen (Kondensatoren entladen)§Reset (discharge capacitors)§Réinitialiser (décharger les condensateurs)§重置（电容放电）§Сброс (разрядить конденсаторы)§रीसेट (संधारित्र निरावेशित करें)§Restituere (condensatores exonerare)
Zeit§Time§Temps§时间§Время§समय§Tempus
Oszilloskop§Oscilloscope§Oscilloscope§示波器§Осциллограф§ऑसिलोस्कोप§Oscilloscopium
■ Beenden§■ Stop§■ Arrêter§■ 结束§■ Завершить§■ समाप्त§■ Finire
Schalter anklicken schaltet um, Taster schließt nur solange gedrückt · Logik-Eingänge (0/1 an den Anschlüssen) anklicken · Bauteil anklicken zeigt es im Oszilloskop§Click a switch to toggle, a push button closes only while pressed · click logic inputs (0/1 at the terminals) · click a component to show it on the oscilloscope§Cliquer un interrupteur le bascule, un bouton-poussoir ne ferme que tant qu’il est pressé · cliquer les entrées logiques (0/1 aux bornes) · cliquer un composant l’affiche à l’oscilloscope§点击开关切换，按钮仅在按住时闭合 · 点击逻辑输入（端子处的 0/1）· 点击元件可在示波器中显示§Щелчок по выключателю переключает, кнопка замкнута, пока нажата · щёлкайте логические входы (0/1 у выводов) · щелчок по детали — в осциллограф§स्विच पर क्लिक से बदलें, पुश-बटन दबाने तक ही बंद · लॉजिक इनपुट (टर्मिनल पर 0/1) क्लिक करें · घटक क्लिक करने पर ऑसिलोस्कोप में§Clausulam preme ut mutes, premendum tantum pressum claudit · introitus logicos (0/1 ad terminos) preme · partem preme ut in oscilloscopio appareat
pro Sekunde§per second§par seconde§每秒§в секунду§प्रति सेकंड§per secundum
Das Fenster wurde blockiert. Bitte Pop-ups für diese Seite erlauben.§The window was blocked. Please allow pop-ups for this site.§La fenêtre a été bloquée. Autorisez les fenêtres pop-up pour ce site.§窗口被阻止。请允许此网站的弹出窗口。§Окно заблокировано. Разрешите всплывающие окна для этого сайта.§विंडो अवरुद्ध हुई। कृपया इस साइट के पॉप-अप की अनुमति दें।§Fenestra impedita est. Fenestras emergentes huic paginae permitte.
Präsentationsfenster geöffnet: auf den Beamer ziehen und dort doppelklicken für Vollbild.§Presentation window opened: drag it to the projector and double-click there for full screen.§Fenêtre de présentation ouverte : faites-la glisser sur le projecteur et double-cliquez pour le plein écran.§演示窗口已打开：拖到投影仪屏幕并双击全屏。§Окно презентации открыто: перетащите на проектор и дважды щёлкните для полного экрана.§प्रस्तुति विंडो खुली: प्रोजेक्टर पर खींचें और पूर्ण स्क्रीन हेतु डबल-क्लिक करें।§Fenestra praesentationis aperta: ad proiectorium trahe et bis preme ut totum spatium impleat.
Pause§Pause§Pause§暂停§Пауза§रोकें§Pausa
Start§Start§Démarrer§开始§Старт§शुरू§Incipere
Zurück§Reset§Remise à zéro§归零§Сброс§रीसेट§Retro
„)“ fehlt§“)” is missing§« ) » manquante§缺少“)”§Не хватает «)»§“)” नहीं है§«)» deest
Leer lassen für ein leeres Koordinatensystem. Beispiele: 2*sin(x - pi/4), x^2 - 1, exp(-x)*cos(5x), sqrt(x)§Leave empty for a blank coordinate system. Examples: 2*sin(x - pi/4), x^2 - 1, exp(-x)*cos(5x), sqrt(x)§Laisser vide pour un repère vide. Exemples : 2*sin(x - pi/4), x^2 - 1, exp(-x)*cos(5x), sqrt(x)§留空则生成空坐标系。例：2*sin(x - pi/4)、x^2 - 1、exp(-x)*cos(5x)、sqrt(x)§Оставьте пустым для пустой системы координат. Примеры: 2*sin(x - pi/4), x^2 - 1, exp(-x)*cos(5x), sqrt(x)§खाली निर्देशांक तंत्र के लिए खाली छोड़ें। उदाहरण: 2*sin(x - pi/4), x^2 - 1, exp(-x)*cos(5x), sqrt(x)§Vacuum relinque pro systemate vacuo. Exempla: 2*sin(x - pi/4), x^2 - 1, exp(-x)*cos(5x), sqrt(x)
x von … bis§x from … to§x de … à§x 从 … 到§x от … до§x … से … तक§x a … ad
y von … bis§y from … to§y de … à§y 从 … 到§y от … до§y … से … तक§y a … ad
cm pro Einheit§cm per unit§cm par unité§每单位厘米§см на единицу§सेमी प्रति इकाई§cm per unitatem
Achsen§Axes§Axes§坐标轴§Оси§अक्ष§Axes
Gitterlinien§Grid lines§Quadrillage§网格线§Линии сетки§ग्रिड रेखाएँ§Cancelli
Diagramm bearbeiten§Edit diagram§Modifier le diagramme§编辑图表§Изменить диаграмму§आरेख संपादित करें§Diagramma mutare
Koordinatensystem§Coordinate system§Repère§坐标系§Система координат§निर्देशांक तंत्र§Systema coordinatarum
Funktionsplotter§Function plotter§Traceur de fonctions§函数绘图器§Построитель графиков§फ़ंक्शन प्लॉटर§Delineator functionum
Bitte gültige Zahlen eingeben.§Please enter valid numbers.§Saisissez des nombres valides.§请输入有效数字。§Введите корректные числа.§कृपया मान्य संख्याएँ डालें।§Numeros validos inscribe.
„bis“ muss größer als „von“ sein.§“to” must be greater than “from”.§« à » doit être supérieur à « de ».§“到”必须大于“从”。§«до» должно быть больше «от».§“तक”, “से” से बड़ा होना चाहिए।§«ad» maius quam «a» esse debet.
Graph§Graph§Courbe§图形§График§ग्राफ़§Graphus
Name§Name§Nom§名称§Имя§नाम§Nomen
Betrag§Magnitude§Module§幅值§Модуль§परिमाण§Magnitudo
Winkel in °§Angle in °§Angle en °§角度 (°)§Угол в °§कोण (°)§Angulus in °
Entfernen§Remove§Retirer§移除§Удалить§हटाएँ§Removere
+ Zeiger§+ Phasor§+ Vecteur§+ 相量§+ Вектор§+ फ़ेज़र§+ Phasor
Zeiger gleicher Art (z. B. alle U) werden gemeinsam skaliert.§Phasors of the same kind (e.g. all U) are scaled together.§Les vecteurs de même nature (p. ex. tous les U) sont mis à l’échelle ensemble.§同类相量（如所有 U）统一缩放。§Векторы одного вида (напр. все U) масштабируются вместе.§एक जैसे फ़ेज़र (जैसे सभी U) साथ स्केल होते हैं।§Phasores eiusdem generis (e.g. omnes U) simul scalantur.
Länge des längsten Zeigers (cm)§Length of the longest phasor (cm)§Longueur du plus long vecteur (cm)§最长相量的长度 (cm)§Длина самого длинного вектора (см)§सबसे लंबे फ़ेज़र की लंबाई (सेमी)§Longitudo maximi phasoris (cm)
Re/Im-Achsen§Re/Im axes§Axes Re/Im§Re/Im 轴§Оси Re/Im§Re/Im अक्ष§Axes Re/Im
Winkel einzeichnen§Draw angles§Tracer les angles§标出角度§Показать углы§कोण दर्शाएँ§Angulos describere
Bode-Diagramm§Bode plot§Diagramme de Bode§波特图§Диаграмма Боде§बोड आरेख§Diagramma Bode
Frequenzachse§Frequency axis§Axe des fréquences§频率轴§Ось частот§आवृत्ति अक्ष§Axis frequentiae
Betrag (oben)§Magnitude (top)§Module (haut)§幅值（上）§Модуль (сверху)§परिमाण (ऊपर)§Magnitudo (supra)
Phase (unten)§Phase (bottom)§Phase (bas)§相位（下）§Фаза (снизу)§कला (नीचे)§Phasis (infra)
Oszilloskop-Raster§Oscilloscope grid§Grille d’oscilloscope§示波器网格§Сетка осциллографа§ऑसिलोस्कोप ग्रिड§Cancelli oscilloscopii
Y-Ablenkung§Y deflection§Déviation Y§Y 偏转§Отклонение Y§Y विक्षेप§Deflexio Y
Zeitbasis§Time base§Base de temps§时基§Развёртка§समय आधार§Basis temporis
Kennlinienfeld§Characteristic curves§Réseau de caractéristiques§特性曲线图§Семейство характеристик§अभिलक्षण वक्र§Campus curvarum
x-Achse§x axis§Axe x§x 轴§Ось x§x अक्ष§Axis x
y-Achse§y axis§Axe y§y 轴§Ось y§y अक्ष§Axis y
x bis§x up to§x jusqu’à§x 最大值§x до§x तक§x usque ad
y bis§y up to§y jusqu’à§y 最大值§y до§y तक§y usque ad
Logarithmisches Papier§Logarithmic paper§Papier logarithmique§对数坐标纸§Логарифмическая бумага§लघुगणकीय कागज़§Charta logarithmica
Polarkoordinaten§Polar coordinates§Coordonnées polaires§极坐标§Полярные координаты§ध्रुवीय निर्देशांक§Coordinatae polares
Radius-Beschriftung§Radius label§Étiquette du rayon§半径标注§Подпись радиуса§त्रिज्या लेबल§Inscriptio radii
Winkelstrahlen alle 30°§Angle rays every 30°§Rayons tous les 30°§每 30° 一条角度线§Лучи через 30°§हर 30° पर कोण रेखाएँ§Radii angulorum per 30°
Zeigerdiagramm (leer)§Phasor diagram (blank)§Diagramme de Fresnel (vide)§相量图（空白）§Векторная диаграмма (пустая)§फ़ेज़र आरेख (खाली)§Diagramma phasorum (vacuum)
Waagerechte Achse§Horizontal axis§Axe horizontal§水平轴§Горизонтальная ось§क्षैतिज अक्ष§Axis horizontalis
Senkrechte Achse§Vertical axis§Axe vertical§竖直轴§Вертикальная ось§ऊर्ध्वाधर अक्ष§Axis perpendicularis
Größe in cm§Size in cm§Taille en cm§尺寸 (cm)§Размер в см§आकार (सेमी)§Magnitudo in cm
Hilfskreise und Winkelstrahlen§Helper circles and angle rays§Cercles et rayons d’aide§辅助圆和角度线§Вспомогательные окружности и лучи§सहायक वृत्त व कोण रेखाएँ§Circuli auxiliares et radii
Leeres Koordinatensystem§Blank coordinate system§Repère vide§空白坐标系§Пустая система координат§खाली निर्देशांक तंत्र§Systema coordinatarum vacuum
Zeigerdiagramm (leer, zum Hineinzeichnen)§Phasor diagram (blank, for drawing in)§Diagramme de Fresnel (vide, pour dessiner)§相量图（空白，可手绘）§Векторная диаграмма (пустая, для рисования)§फ़ेज़र आरेख (खाली, अंदर बनाने हेतु)§Diagramma phasorum (vacuum, ad pingendum)
Bode-Diagramm (Betrag und Phase)§Bode plot (magnitude and phase)§Diagramme de Bode (module et phase)§波特图（幅值与相位）§Диаграмма Боде (модуль и фаза)§बोड आरेख (परिमाण व कला)§Diagramma Bode (magnitudo et phasis)
Oszilloskop-Raster (10 × 8 Teile)§Oscilloscope grid (10 × 8 div)§Grille d’oscilloscope (10 × 8 div)§示波器网格（10 × 8 格）§Сетка осциллографа (10 × 8 дел)§ऑसिलोस्कोप ग्रिड (10 × 8 खंड)§Cancelli oscilloscopii (10 × 8 partes)
Logarithmisches Papier (4 Dekaden)§Logarithmic paper (4 decades)§Papier logarithmique (4 décades)§对数坐标纸（4 个十倍程）§Логарифмическая бумага (4 декады)§लघुगणकीय कागज़ (4 दशक)§Charta logarithmica (4 decades)
Widerstand§Resistor§Résistance§电阻§Резистор§प्रतिरोधक§Resistor
Grundbauteile§Basic components§Composants de base§基本元件§Базовые детали§मूल घटक§Partes fundamentales
Widerstand (US)§Resistor (US)§Résistance (US)§电阻（美标）§Резистор (US)§प्रतिरोधक (US)§Resistor (US)
Potentiometer§Potentiometer§Potentiomètre§电位器§Потенциометр§पोटेंशियोमीटर§Potentiometrum
Kondensator§Capacitor§Condensateur§电容§Конденсатор§संधारित्र§Condensator
Elko (gepolt)§Electrolytic capacitor (polarised)§Condensateur électrolytique (polarisé)§电解电容（有极性）§Электролитический (полярный)§विद्युत-अपघटनी संधारित्र (ध्रुवित)§Condensator electrolyticus
Spule§Inductor§Bobine§电感§Катушка§प्रेरक§Inductor
Transformator§Transformer§Transformateur§变压器§Трансформатор§ट्रांसफ़ॉर्मर§Transformator
Sicherung§Fuse§Fusible§保险丝§Предохранитель§फ़्यूज़§Fusibile
Quarz§Crystal§Quartz§晶振§Кварц§क्रिस्टल§Crystallus
Schalter§Switch§Interrupteur§开关§Выключатель§स्विच§Clausula
Taster§Push button§Bouton-poussoir§按钮§Кнопка§पुश-बटन§Premendum
Glühlampe§Lamp§Lampe§灯泡§Лампа§बल्ब§Lampas
Knoten§Junction§Nœud§节点§Узел§संधि§Nodus
Anschluss§Terminal§Borne§端子§Вывод§टर्मिनल§Terminus
Diode§Diode§Diode§二极管§Диод§डायोड§Diodus
Halbleiter§Semiconductors§Semi-conducteurs§半导体§Полупроводники§अर्धचालक§Semiconductores
Z-Diode§Zener diode§Diode Zener§稳压二极管§Стабилитрон§ज़ेनर डायोड§Diodus Zener
Thyristor§Thyristor§Thyristor§晶闸管§Тиристор§थाइरिस्टर§Thyristor
NPN-Transistor§NPN transistor§Transistor NPN§NPN 晶体管§Транзистор NPN§NPN ट्रांजिस्टर§Transistor NPN
PNP-Transistor§PNP transistor§Transistor PNP§PNP 晶体管§Транзистор PNP§PNP ट्रांजिस्टर§Transistor PNP
Spannungsquelle§Voltage source§Source de tension§电压源§Источник напряжения§वोल्टेज स्रोत§Fons tensionis
Quellen & Messgeräte§Sources & meters§Sources & appareils de mesure§电源与仪表§Источники и приборы§स्रोत व मीटर§Fontes & instrumenta mensurae
Batterie§Battery§Pile§电池§Батарея§बैटरी§Pila
Wechselspannungsquelle§AC voltage source§Source de tension alternative§交流电压源§Источник переменного напряжения§AC वोल्टेज स्रोत§Fons tensionis alternae
Stromquelle§Current source§Source de courant§电流源§Источник тока§धारा स्रोत§Fons currentis
Erdung§Ground§Terre§接地§Заземление§अर्थिंग§Terra
Versorgung (+Vcc)§Supply (+Vcc)§Alimentation (+Vcc)§电源 (+Vcc)§Питание (+Vcc)§आपूर्ति (+Vcc)§Alimentum (+Vcc)
Amperemeter§Ammeter§Ampèremètre§电流表§Амперметр§एमीटर§Amperometrum
Voltmeter§Voltmeter§Voltmètre§电压表§Вольтметр§वोल्टमीटर§Voltometrum
Motor§Motor§Moteur§电动机§Двигатель§मोटर§Motor
Spannungspfeil§Voltage arrow§Flèche de tension§电压箭头§Стрелка напряжения§वोल्टेज तीर§Sagitta tensionis
Operationsverstärker§Op-amp§Amplificateur opérationnel§运算放大器§Операционный усилитель§ऑप-एम्प§Amplificator operationalis
Verstärker & Logik§Amplifiers & logic§Amplificateurs & logique§放大器与逻辑§Усилители и логика§प्रवर्धक व लॉजिक§Amplificatores & logica
Operationsverstärker (+ oben)§Op-amp (+ on top)§Ampli-op (+ en haut)§运算放大器（+ 在上）§ОУ (+ сверху)§ऑप-एम्प (+ ऊपर)§Amplificator operationalis (+ supra)
UND (AND)§AND§ET (AND)§与 (AND)§И (AND)§AND§ET (AND)
ODER (OR)§OR§OU (OR)§或 (OR)§ИЛИ (OR)§OR§VEL (OR)
NICHT (NOT)§NOT§NON (NOT)§非 (NOT)§НЕ (NOT)§NOT§NON (NOT)
Puffer§Buffer§Tampon§缓冲器§Буфер§बफ़र§Tampon
Einstellbarer Widerstand§Variable resistor§Résistance réglable§可调电阻§Переменный резистор§परिवर्ती प्रतिरोधक§Resistor variabilis
Heißleiter (NTC)§Thermistor (NTC)§Thermistance (CTN)§热敏电阻 (NTC)§Термистор (NTC)§थर्मिस्टर (NTC)§Thermistor (NTC)
Kaltleiter (PTC)§Thermistor (PTC)§Thermistance (CTP)§热敏电阻 (PTC)§Позистор (PTC)§थर्मिस्टर (PTC)§Thermistor (PTC)
Fotowiderstand (LDR)§Photoresistor (LDR)§Photorésistance (LDR)§光敏电阻 (LDR)§Фоторезистор (LDR)§प्रकाश-प्रतिरोधक (LDR)§Photoresistor (LDR)
Drehkondensator§Variable capacitor§Condensateur variable§可变电容§Переменный конденсатор§परिवर्ती संधारित्र§Condensator variabilis
Spule mit Eisenkern§Iron-core inductor§Bobine à noyau de fer§铁芯电感§Катушка с сердечником§लौह-क्रोड प्रेरक§Inductor nucleo ferreo
Transformator (Kreise)§Transformer (circles)§Transformateur (cercles)§变压器（圆形符号）§Трансформатор (круги)§ट्रांसफ़ॉर्मर (वृत्त)§Transformator (circuli)
Wechselschalter§Changeover switch§Inverseur§单刀双掷开关§Переключатель§परिवर्तन स्विच§Clausula alterna
Relais (Spule)§Relay (coil)§Relais (bobine)§继电器（线圈）§Реле (катушка)§रिले (कुंडली)§Relais (spira)
Lautsprecher§Loudspeaker§Haut-parleur§扬声器§Громкоговоритель§लाउडस्पीकर§Altoparlans
Antenne§Antenna§Antenne§天线§Антенна§एंटीना§Antenna
Masse (Gehäuse)§Chassis ground§Masse (châssis)§机壳接地§Корпус§चेसिस ग्राउंड§Massa (involucrum)
Kreuzung ohne Verbindung§Crossing without connection§Croisement sans connexion§无连接交叉§Пересечение без соединения§बिना जोड़ का क्रॉसिंग§Decussatio sine nexu
Schottky-Diode§Schottky diode§Diode Schottky§肖特基二极管§Диод Шоттки§शॉटकी डायोड§Diodus Schottky
Fotodiode§Photodiode§Photodiode§光电二极管§Фотодиод§फ़ोटोडायोड§Photodiodus
Fototransistor§Phototransistor§Phototransistor§光电晶体管§Фототранзистор§फ़ोटोट्रांजिस्टर§Phototransistor
N-Kanal-JFET§N-channel JFET§JFET canal N§N 沟道 JFET§JFET с каналом N§N-चैनल JFET§JFET canalis N
Optokoppler§Optocoupler§Optocoupleur§光耦§Оптрон§ऑप्टोकपलर§Optocopulator
Gesteuerte Spannungsquelle§Controlled voltage source§Source de tension commandée§受控电压源§Управляемый источник напряжения§नियंत्रित वोल्टेज स्रोत§Fons tensionis rectus
Gesteuerte Stromquelle§Controlled current source§Source de courant commandée§受控电流源§Управляемый источник тока§नियंत्रित धारा स्रोत§Fons currentis rectus
Solarzelle§Solar cell§Cellule solaire§太阳能电池§Солнечный элемент§सौर सेल§Cellula solaris
Generator§Generator§Générateur§发电机§Генератор§जनित्र§Generator
Drehstrommotor§Three-phase motor§Moteur triphasé§三相电动机§Трёхфазный двигатель§त्रि-फ़ेज़ मोटर§Motor triphasicus
Leistungsmesser§Wattmeter§Wattmètre§功率表§Ваттметр§वाटमीटर§Wattometrum
Ohmmeter§Ohmmeter§Ohmmètre§欧姆表§Омметр§ओममीटर§Ohmometrum
Strompfeil§Current arrow§Flèche de courant§电流箭头§Стрелка тока§धारा तीर§Sagitta currentis
Schmitt-Trigger§Schmitt trigger§Trigger de Schmitt§施密特触发器§Триггер Шмитта§श्मिट ट्रिगर§Trigger Schmitt
Komparator§Comparator§Comparateur§比较器§Компаратор§तुलनित्र§Comparator
D-Flipflop§D flip-flop§Bascule D§D 触发器§D-триггер§D फ़्लिप-फ़्लॉप§Flip-flop D
RS-Flipflop§SR flip-flop§Bascule RS§RS 触发器§RS-триггер§RS फ़्लिप-फ़्लॉप§Flip-flop RS
Pflichtfelder fehlen§Required fields missing§Champs obligatoires manquants§缺少必填字段§Нет обязательных полей§आवश्यक फ़ील्ड नहीं हैं§Agri necessarii desunt
Pfad ist kein Text§Path is not text§Le chemin n’est pas du texte§路径不是文本§Путь не является текстом§पथ पाठ नहीं है§Via textus non est
Eigene Symbole§Custom symbols§Symboles personnels§自定义符号§Свои символы§अपने प्रतीक§Signa propria
Spannungsteiler§Voltage divider§Diviseur de tension§分压器§Делитель напряжения§वोल्टेज विभाजक§Divisor tensionis
Zwei Widerstände teilen die Spannung U₀ in U₂.§Two resistors divide the voltage U₀ into U₂.§Deux résistances divisent la tension U₀ en U₂.§两个电阻将电压 U₀ 分压为 U₂。§Два резистора делят напряжение U₀ до U₂.§दो प्रतिरोधक वोल्टेज U₀ को U₂ में बाँटते हैं।§Duo resistores tensionem U₀ in U₂ dividunt.
RC-Tiefpass§RC low-pass§Passe-bas RC§RC 低通§RC фильтр нижних частот§RC लो-पास§Filtrum RC humile
Passive Filterschaltung 1. Ordnung, Grenzfrequenz f = 1/(2πRC).§Passive first-order filter, cut-off frequency f = 1/(2πRC).§Filtre passif du 1er ordre, fréquence de coupure f = 1/(2πRC).§一阶无源滤波器，截止频率 f = 1/(2πRC)。§Пассивный фильтр 1-го порядка, частота среза f = 1/(2πRC).§प्रथम कोटि निष्क्रिय फ़िल्टर, कट-ऑफ़ आवृत्ति f = 1/(2πRC)।§Filtrum passivum primi ordinis, frequentia limitis f = 1/(2πRC).
RC-Hochpass§RC high-pass§Passe-haut RC§RC 高通§RC фильтр верхних частот§RC हाई-पास§Filtrum RC altum
RLC-Reihenschwingkreis§RLC series resonant circuit§Circuit résonant RLC série§RLC 串联谐振电路§Последовательный RLC-контур§RLC श्रेणी अनुनादी परिपथ§Circuitus resonans RLC seriatim
Reihenschaltung aus R, L und C an einer Wechselspannungsquelle.§Series connection of R, L and C on an AC source.§R, L et C en série sur une source alternative.§R、L、C 串联接在交流电源上。§Последовательное соединение R, L и C с источником переменного напряжения.§AC स्रोत पर R, L और C श्रेणी में।§R, L et C seriatim ad fontem alternum.
Invertierender Verstärker§Inverting amplifier§Amplificateur inverseur§反相放大器§Инвертирующий усилитель§इनवर्टिंग प्रवर्धक§Amplificator invertens
Verstärkung v = −R₂/R₁.§Gain v = −R₂/R₁.§Gain v = −R₂/R₁.§增益 v = −R₂/R₁。§Коэффициент усиления v = −R₂/R₁.§लाभ v = −R₂/R₁।§Amplificatio v = −R₂/R₁.
Integrierer (Op-Amp)§Integrator (op-amp)§Intégrateur (ampli-op)§积分器（运放）§Интегратор (ОУ)§समाकलक (ऑप-एम्प)§Integrator (amplificator)
Ausgang ist das Integral der Eingangsspannung.§The output is the integral of the input voltage.§La sortie est l’intégrale de la tension d’entrée.§输出为输入电压的积分。§Выход — интеграл входного напряжения.§आउटपुट इनपुट वोल्टेज का समाकल है।§Exitus est integrale tensionis introitus.
Differenzierer (Op-Amp)§Differentiator (op-amp)§Dérivateur (ampli-op)§微分器（运放）§Дифференциатор (ОУ)§अवकलक (ऑप-एम्प)§Differentiator (amplificator)
Ausgang ist die Ableitung der Eingangsspannung.§The output is the derivative of the input voltage.§La sortie est la dérivée de la tension d’entrée.§输出为输入电压的导数。§Выход — производная входного напряжения.§आउटपुट इनपुट वोल्टेज का अवकलज है।§Exitus est derivata tensionis introitus.
Nichtinvertierender Verstärker§Non-inverting amplifier§Amplificateur non inverseur§同相放大器§Неинвертирующий усилитель§नॉन-इनवर्टिंग प्रवर्धक§Amplificator non invertens
Verstärkung v = 1 + R₂/R₁.§Gain v = 1 + R₂/R₁.§Gain v = 1 + R₂/R₁.§增益 v = 1 + R₂/R₁。§Коэффициент усиления v = 1 + R₂/R₁.§लाभ v = 1 + R₂/R₁।§Amplificatio v = 1 + R₂/R₁.
Einweggleichrichter mit Glättung§Half-wave rectifier with smoothing§Redresseur simple alternance avec filtrage§带滤波的半波整流器§Однополупериодный выпрямитель со сглаживанием§समतलन सहित अर्ध-तरंग दिष्टकारी§Rectificator dimidiae undae cum levatione
Eine Diode lässt nur eine Halbwelle durch, C glättet.§A diode passes only one half-wave, C smooths.§Une diode ne laisse passer qu’une alternance, C filtre.§二极管只让一个半波通过，C 进行滤波。§Диод пропускает одну полуволну, C сглаживает.§डायोड केवल एक अर्ध-तरंग पार करने देता है, C समतल करता है।§Diodus unam tantum dimidiam undam transmittit, C levat.
Brückengleichrichter (Graetz)§Bridge rectifier (Graetz)§Pont redresseur (Graetz)§桥式整流器（格雷茨）§Мостовой выпрямитель (Гретца)§सेतु दिष्टकारी (ग्रेट्ज़)§Rectificator pontis (Graetz)
Vier Dioden richten beide Halbwellen gleich.§Four diodes rectify both half-waves.§Quatre diodes redressent les deux alternances.§四个二极管整流两个半波。§Четыре диода выпрямляют обе полуволны.§चार डायोड दोनों अर्ध-तरंगों को दिष्ट करते हैं।§Quattuor diodi ambas dimidias undas rectificant.
Z-Dioden-Stabilisierung§Zener stabiliser§Stabilisation par diode Zener§稳压二极管稳压§Стабилизация стабилитроном§ज़ेनर स्थिरीकरण§Stabilitio Zener
Die Z-Diode hält die Ausgangsspannung konstant.§The Zener diode keeps the output voltage constant.§La diode Zener maintient la tension de sortie constante.§稳压二极管使输出电压保持恒定。§Стабилитрон поддерживает постоянное выходное напряжение.§ज़ेनर डायोड आउटपुट वोल्टेज स्थिर रखता है।§Diodus Zener tensionem exitus constantem tenet.
Vorwiderstand§Series resistor§Résistance série§限流电阻§Добавочный резистор§श्रेणी प्रतिरोधक§Resistor praevius
LED mit Vorwiderstand§LED with series resistor§LED avec résistance série§带限流电阻的 LED§Светодиод с резистором§श्रेणी प्रतिरोधक सहित LED§LED cum resistore praevio
R = (U₀ − U_LED) / I_LED.§R = (U₀ − U_LED) / I_LED.§R = (U₀ − U_LED) / I_LED.§R = (U₀ − U_LED) / I_LED。§R = (U₀ − U_LED) / I_LED.§R = (U₀ − U_LED) / I_LED।§R = (U₀ − U_LED) / I_LED.
Emitterschaltung (NPN)§Common-emitter stage (NPN)§Montage émetteur commun (NPN)§共射极电路 (NPN)§Схема с общим эмиттером (NPN)§उभयनिष्ठ उत्सर्जक (NPN)§Gradus emissoris communis (NPN)
Verstärkerstufe mit Basisspannungsteiler und Emitterwiderstand.§Amplifier stage with base voltage divider and emitter resistor.§Étage amplificateur avec pont de base et résistance d’émetteur.§带基极分压器和发射极电阻的放大级。§Усилительный каскад с делителем в базе и резистором в эмиттере.§आधार वोल्टेज विभाजक व उत्सर्जक प्रतिरोधक सहित प्रवर्धक चरण।§Gradus amplificans cum divisore basis et resistore emissoris.
MOSFET als Schalter§MOSFET as a switch§MOSFET en commutation§MOSFET 作开关§MOSFET как ключ§स्विच के रूप में MOSFET§MOSFET ut clausula
N-MOSFET schaltet eine Last gegen Erde.§An N-MOSFET switches a load to ground.§Un MOSFET N commute une charge vers la masse.§N 沟道 MOSFET 将负载接地开关。§N-MOSFET коммутирует нагрузку на землю.§N-MOSFET भार को अर्थ से जोड़ता है।§N-MOSFET onus ad terram commutat.
Last§Load§Charge§负载§Нагрузка§भार§Onus
Halbaddierer§Half adder§Demi-additionneur§半加器§Полусумматор§अर्ध योजक§Semiadditor
Summe S = A ⊕ B, Übertrag C = A · B.§Sum S = A ⊕ B, carry C = A · B.§Somme S = A ⊕ B, retenue C = A · B.§和 S = A ⊕ B，进位 C = A · B。§Сумма S = A ⊕ B, перенос C = A · B.§योग S = A ⊕ B, हासिल C = A · B।§Summa S = A ⊕ B, translatio C = A · B.
Spannungsfolger (Impedanzwandler)§Voltage follower (buffer)§Suiveur de tension (adaptateur d’impédance)§电压跟随器（阻抗变换器）§Повторитель напряжения§वोल्टेज अनुगामी (बफ़र)§Sectator tensionis
Verstärkung 1, sehr hoher Eingangs-, kleiner Ausgangswiderstand.§Gain 1, very high input and low output impedance.§Gain 1, impédance d’entrée très élevée, de sortie faible.§增益 1，输入阻抗很高，输出阻抗很低。§Усиление 1, очень высокое входное и малое выходное сопротивление.§लाभ 1, बहुत उच्च इनपुट व कम आउटपुट प्रतिबाधा।§Amplificatio 1, impedantia introitus magna, exitus parva.
Summierer (Addierer)§Summing amplifier (adder)§Sommateur (additionneur)§加法器§Сумматор§योजक (एडर)§Summator (additor)
Subtrahierer (Differenzverstärker)§Subtractor (difference amplifier)§Soustracteur (amplificateur différentiel)§减法器（差分放大器）§Вычитатель (дифференциальный усилитель)§व्यवकलक (अंतर प्रवर्धक)§Subtractor (amplificator differentialis)
Bei R₁ = R₂ und R_f = R₄: Uₐ = R_f/R₁ · (U₂ − U₁).§With R₁ = R₂ and R_f = R₄: Uₐ = R_f/R₁ · (U₂ − U₁).§Avec R₁ = R₂ et R_f = R₄ : Uₐ = R_f/R₁ · (U₂ − U₁).§当 R₁ = R₂ 且 R_f = R₄ 时：Uₐ = R_f/R₁ · (U₂ − U₁)。§При R₁ = R₂ и R_f = R₄: Uₐ = R_f/R₁ · (U₂ − U₁).§R₁ = R₂ और R_f = R₄ पर: Uₐ = R_f/R₁ · (U₂ − U₁)।§Si R₁ = R₂ et R_f = R₄: Uₐ = R_f/R₁ · (U₂ − U₁).
Schmitt-Trigger (nicht invertierend)§Schmitt trigger (non-inverting)§Trigger de Schmitt (non inverseur)§施密特触发器（同相）§Триггер Шмитта (неинвертирующий)§श्मिट ट्रिगर (नॉन-इनवर्टिंग)§Trigger Schmitt (non invertens)
Mitkopplung über R₂ erzeugt eine Hysterese mit zwei Schaltschwellen.§Positive feedback via R₂ creates hysteresis with two thresholds.§La réaction positive via R₂ crée une hystérésis à deux seuils.§经 R₂ 的正反馈产生具有两个阈值的迟滞。§Положительная обратная связь через R₂ создаёт гистерезис с двумя порогами.§R₂ द्वारा धनात्मक पुनर्भरण दो सीमाओं वाला शैथिल्य बनाता है।§Retroactio positiva per R₂ hysteresim cum duobus liminibus facit.
Wheatstone-Brücke§Wheatstone bridge§Pont de Wheatstone§惠斯通电桥§Мост Уитстона§व्हीटस्टोन सेतु§Pons Wheatstone
Abgeglichen (U_d = 0), wenn R₁/R₂ = R₃/R₄.§Balanced (U_d = 0) when R₁/R₂ = R₃/R₄.§Équilibré (U_d = 0) si R₁/R₂ = R₃/R₄.§当 R₁/R₂ = R₃/R₄ 时平衡（U_d = 0）。§Сбалансирован (U_d = 0), если R₁/R₂ = R₃/R₄.§संतुलित (U_d = 0) जब R₁/R₂ = R₃/R₄।§Aequatus (U_d = 0), si R₁/R₂ = R₃/R₄.
RL-Tiefpass§RL low-pass§Passe-bas RL§RL 低通§RL фильтр нижних частот§RL लो-पास§Filtrum RL humile
Grenzfrequenz f = R/(2πL).§Cut-off frequency f = R/(2πL).§Fréquence de coupure f = R/(2πL).§截止频率 f = R/(2πL)。§Частота среза f = R/(2πL).§कट-ऑफ़ आवृत्ति f = R/(2πL)।§Frequentia limitis f = R/(2πL).
RL-Hochpass§RL high-pass§Passe-haut RL§RL 高通§RL фильтр верхних частот§RL हाई-पास§Filtrum RL altum
LC-Parallelschwingkreis§LC parallel resonant circuit§Circuit résonant LC parallèle§LC 并联谐振电路§Параллельный LC-контур§LC समांतर अनुनादी परिपथ§Circuitus resonans LC parallelus
Resonanzfrequenz f₀ = 1/(2π√(LC)).§Resonant frequency f₀ = 1/(2π√(LC)).§Fréquence de résonance f₀ = 1/(2π√(LC)).§谐振频率 f₀ = 1/(2π√(LC))。§Резонансная частота f₀ = 1/(2π√(LC)).§अनुनाद आवृत्ति f₀ = 1/(2π√(LC))।§Frequentia resonantiae f₀ = 1/(2π√(LC)).
Strom- und Spannungsmessung§Current and voltage measurement§Mesure de courant et de tension§电流与电压测量§Измерение тока и напряжения§धारा व वोल्टेज मापन§Mensura currentis et tensionis
Amperemeter in Reihe, Voltmeter parallel zum Verbraucher.§Ammeter in series, voltmeter in parallel with the load.§Ampèremètre en série, voltmètre en parallèle sur la charge.§电流表串联，电压表与负载并联。§Амперметр последовательно, вольтметр параллельно нагрузке.§एमीटर श्रेणी में, वोल्टमीटर भार के समांतर।§Amperometrum seriatim, voltometrum parallelum oneri.
Kollektorschaltung (Emitterfolger)§Common-collector (emitter follower)§Collecteur commun (émetteur suiveur)§共集电极（射极跟随器）§Схема с общим коллектором (эмиттерный повторитель)§उभयनिष्ठ संग्राहक (उत्सर्जक अनुगामी)§Collector communis (sectator emissoris)
Spannungsverstärkung ≈ 1, Uₐ ≈ Uₑ − 0,7 V.§Voltage gain ≈ 1, Uₐ ≈ Uₑ − 0.7 V.§Gain en tension ≈ 1, Uₐ ≈ Uₑ − 0,7 V.§电压增益 ≈ 1，Uₐ ≈ Uₑ − 0.7 V。§Усиление по напряжению ≈ 1, Uₐ ≈ Uₑ − 0,7 В.§वोल्टेज लाभ ≈ 1, Uₐ ≈ Uₑ − 0.7 V।§Amplificatio tensionis ≈ 1, Uₐ ≈ Uₑ − 0,7 V.
Stromspiegel (NPN)§Current mirror (NPN)§Miroir de courant (NPN)§电流镜 (NPN)§Токовое зеркало (NPN)§धारा दर्पण (NPN)§Speculum currentis (NPN)
T₂ spiegelt den Referenzstrom: I_aus ≈ I_ref.§T₂ mirrors the reference current: I_out ≈ I_ref.§T₂ recopie le courant de référence : I_sortie ≈ I_réf.§T₂ 镜像参考电流：I_out ≈ I_ref。§T₂ повторяет опорный ток: I_вых ≈ I_оп.§T₂ संदर्भ धारा को दोहराता है: I_out ≈ I_ref।§T₂ currentem relationis reddit: I_exitus ≈ I_ref.
Eigene Schaltung§Custom circuit§Circuit personnel§自定义电路§Своя схема§अपना परिपथ§Circuitus proprius
Auswahl (V)§Select (V)§Sélection (V)§选择 (V)§Выбор (V)§चयन (V)§Electio (V)
Verschieben (H)§Pan (H)§Déplacer (H)§平移 (H)§Перемещение (H)§खिसकाएँ (H)§Movere (H)
Stift (P)§Pen (P)§Stylo (P)§笔 (P)§Перо (P)§पेन (P)§Stilus (P)
Radierer (E)§Eraser (E)§Gomme (E)§橡皮擦 (E)§Ластик (E)§रबड़ (E)§Deletrix (E)
Linie (L)§Line (L)§Ligne (L)§直线 (L)§Линия (L)§रेखा (L)§Linea (L)
Pfeil (A)§Arrow (A)§Flèche (A)§箭头 (A)§Стрелка (A)§तीर (A)§Sagitta (A)
Rechteck (R)§Rectangle (R)§Rectangle (R)§矩形 (R)§Прямоугольник (R)§आयत (R)§Rectangulum (R)
Ellipse (O)§Ellipse (O)§Ellipse (O)§椭圆 (O)§Эллипс (O)§दीर्घवृत्त (O)§Ellipsis (O)
Text (T)§Text (T)§Texte (T)§文本 (T)§Текст (T)§पाठ (T)§Textus (T)
Haftnotiz (N)§Sticky note (N)§Note adhésive (N)§便签 (N)§Стикер (N)§चिपकने वाला नोट (N)§Schedula (N)
Bild oder PDF einfügen§Insert image or PDF§Insérer une image ou un PDF§插入图片或 PDF§Вставить изображение или PDF§चित्र या PDF डालें§Imaginem vel PDF inserere
Zirkel (C)§Compass (C)§Compas (C)§圆规 (C)§Циркуль (C)§परकार (C)§Circinus (C)
Lineal 1:1 (U)§Ruler 1:1 (U)§Règle 1:1 (U)§1:1 直尺 (U)§Линейка 1:1 (U)§रूलर 1:1 (U)§Regula 1:1 (U)
Geodreieck (G)§Set square (G)§Équerre (G)§三角尺 (G)§Угольник (G)§सेट स्क्वेयर (G)§Norma (G)
Parabel (K)§Parabola (K)§Parabole (K)§抛物线 (K)§Парабола (K)§परवलय (K)§Parabola (K)
Laserpointer (J)§Laser pointer (J)§Pointeur laser (J)§激光笔 (J)§Лазерная указка (J)§लेज़र पॉइंटर (J)§Index laser (J)
Petit Fourier (Fourier-Reihe)§Petit Fourier (Fourier series)§Petit Fourier (série de Fourier)§小傅里叶（傅里叶级数）§Petit Fourier (ряд Фурье)§पेटिट फ़ूरिये (फ़ूरिये श्रेणी)§Petit Fourier (series Fourier)
Elektronik-Baukasten (B)§Electronics kit (B)§Boîte à électronique (B)§电子元件箱 (B)§Конструктор электроники (B)§इलेक्ट्रॉनिक्स किट (B)§Arcula electronica (B)
Leitung ziehen (W)§Draw wire (W)§Tracer un fil (W)§绘制导线 (W)§Провести провод (W)§तार खींचें (W)§Filum ducere (W)
Schaltung simulieren§Simulate circuit§Simuler le circuit§仿真电路§Моделировать схему§परिपथ अनुकरण§Circuitum simulare
Durchgezogen§Solid§Continu§实线§Сплошная§ठोस§Continua
Gestrichelt§Dashed§Tirets§虚线§Штриховая§डैश§Interrupta
Gepunktet§Dotted§Pointillé§点线§Пунктирная§बिंदुदार§Punctata
Strich-Punkt§Dash-dot§Trait-point§点划线§Штрихпунктир§डैश-बिंदु§Linea et punctum
Farbe§Colour§Couleur§颜色§Цвет§रंग§Color
Automatisch (schwarz/weiß)§Automatic (black/white)§Automatique (noir/blanc)§自动（黑/白）§Авто (чёрный/белый)§स्वचालित (काला/सफ़ेद)§Sponte (niger/albus)
Eigene Farbe§Custom colour§Couleur personnalisée§自定义颜色§Свой цвет§अपना रंग§Color proprius
Dicke§Thickness§Épaisseur§粗细§Толщина§मोटाई§Crassitudo
Linientyp§Line type§Type de trait§线型§Тип линии§रेखा प्रकार§Genus lineae
Beim Füllfederhalter nicht verfügbar§Not available for the fountain pen§Indisponible pour le stylo plume§钢笔不可用§Недоступно для перьевой ручки§फ़ाउंटेन पेन में उपलब्ध नहीं§Calamo fontano non praesto
Auswahl§Selection§Sélection§选择§Выбор§चयन§Electio
Verschieben§Pan§Déplacer§平移§Перемещение§खिसकाएँ§Movere
Radierer§Eraser§Gomme§橡皮擦§Ластик§रबड़§Deletrix
Linie§Line§Ligne§直线§Линия§रेखा§Linea
Pfeil§Arrow§Flèche§箭头§Стрелка§तीर§Sagitta
Ellipse§Ellipse§Ellipse§椭圆§Эллипс§दीर्घवृत्त§Ellipsis
Text§Text§Texte§文本§Текст§पाठ§Textus
Haftnotiz§Sticky note§Note adhésive§便签§Стикер§चिपकने वाला नोट§Schedula
Bauteil platzieren§Place component§Placer un composant§放置元件§Разместить деталь§घटक रखें§Partem ponere
Leitung ziehen§Draw wire§Tracer un fil§绘制导线§Провести провод§तार खींचें§Filum ducere
Eigenschaften aufklappen§Expand properties§Déplier les propriétés§展开属性§Развернуть свойства§गुण खोलें§Proprietates explicare
Eigenschaften einklappen§Collapse properties§Replier les propriétés§收起属性§Свернуть свойства§गुण बंद करें§Proprietates complicare
Wachstafeln§Wax tablets§Tablettes de cire§蜡板§Восковые таблички§मोम पट्टिकाएँ§Tabulae ceratae
Größe§Size§Taille§大小§Размер§आकार§Magnitudo
Klein§Small§Petit§小§Мелкий§छोटा§Parvum
Groß§Large§Grand§大§Крупный§बड़ा§Magnum
Sehr groß§Very large§Très grand§特大§Очень крупный§बहुत बड़ा§Maximum
Modus§Mode§Mode§模式§Режим§मोड§Modus
Teile§Parts§Parties§局部§Части§भाग§Partes
Ganze Striche§Whole strokes§Traits entiers§整条笔画§Целые штрихи§पूरी रेखाएँ§Lineae totae
Bilder und PDFs bleiben beim Radieren erhalten.§Images and PDFs are kept when erasing.§Les images et PDF sont conservés lors de l’effacement.§擦除时保留图片和 PDF。§Изображения и PDF не стираются.§मिटाते समय चित्र और PDF बने रहते हैं।§Imagines et PDF delendo manent.
Linienfarbe§Line colour§Couleur du trait§线条颜色§Цвет линии§रेखा रंग§Color lineae
Füllung§Fill§Remplissage§填充§Заливка§भराव§Impletio
Form füllen (in Linienfarbe)§Fill shape (in line colour)§Remplir la forme (couleur du trait)§填充形状（线条颜色）§Залить фигуру (цветом линии)§आकृति भरें (रेखा रंग में)§Figuram implere (colore lineae)
Notizfarbe§Note colour§Couleur de la note§便签颜色§Цвет стикера§नोट रंग§Color schedulae
Textfarbe§Text colour§Couleur du texte§文字颜色§Цвет текста§पाठ रंग§Color textus
Schrift§Font§Police§字体§Шрифт§फ़ॉन्ट§Litterae
Fett§Bold§Gras§粗体§Жирный§मोटा§Crassae
Kursiv§Italic§Italique§斜体§Курсив§तिरछा§Obliquae
Notizgröße§Note size§Taille de la note§便签大小§Размер стикера§नोट आकार§Magnitudo schedulae
Öffnungswinkel§Opening angle§Angle d’ouverture§张角§Угол раствора§खुलने का कोण§Angulus aperturae
Schenkellänge§Leg length§Longueur des branches§腿长§Длина ножек§भुजा लंबाई§Longitudo crurum
Mittelpunkt setzen, dann den roten Punkt ziehen.§Set the centre, then drag the red point.§Placez le centre, puis tirez le point rouge.§先放置圆心，再拖动红点。§Поставьте центр, затем тяните красную точку.§केंद्र रखें, फिर लाल बिंदु खींचें।§Centrum pone, deinde punctum rubrum trahe.
Roten Punkt ziehen zeichnet den Bogen.§Dragging the red point draws the arc.§Tirer le point rouge trace l’arc.§拖动红点绘制圆弧。§Перетаскивание красной точки рисует дугу.§लाल बिंदु खींचने से चाप बनता है।§Punctum rubrum trahens arcum ducis.
Strichfarbe§Stroke colour§Couleur du trait§笔画颜色§Цвет штриха§रेखा रंग§Color lineae
Klick setzt ab · Q dreht · Esc bricht ab§Click places · Q rotates · Esc cancels§Clic pour poser · Q pivote · Échap annule§点击放置 · Q 旋转 · Esc 取消§Щелчок — поставить · Q — повернуть · Esc — отмена§क्लिक से रखें · Q घुमाए · Esc रद्द§Preme ut ponas · Q vertit · Esc abrogat
Klick setzt · Q dreht · Esc beendet§Click places · Q rotates · Esc finishes§Clic pour placer · Q pivote · Échap termine§点击放置 · Q 旋转 · Esc 结束§Щелчок — поставить · Q — повернуть · Esc — завершить§क्लिक से रखें · Q घुमाए · Esc समाप्त§Preme ut ponas · Q vertit · Esc finit
Anklicken oder Rahmen aufziehen.§Click or drag a frame.§Cliquez ou tracez un cadre.§点击或拖出选框。§Щёлкните или растяните рамку.§क्लिक करें या फ़्रेम खींचें।§Preme vel quadrum trahe.
Ziehen verschiebt die Ansicht.§Dragging moves the view.§Faire glisser déplace la vue.§拖动可移动视图。§Перетаскивание сдвигает вид.§खींचने से दृश्य खिसकता है।§Trahens conspectum moves.
Drehung§Rotation§Rotation§旋转§Поворот§घुमाव§Rotatio
Wert (Simulation)§Value (simulation)§Valeur (simulation)§数值（仿真）§Значение (моделирование)§मान (अनुकरण)§Valor (simulatio)
Beschriftung§Label§Étiquette§标注§Подпись§लेबल§Inscriptio
Strichstärke§Line width§Épaisseur du trait§线宽§Толщина линии§रेखा मोटाई§Crassitudo lineae
Anordnen§Arrange§Disposer§排列§Порядок§व्यवस्थित करें§Ordinare
Nach vorn§Bring forward§Avancer§置前§Вперёд§आगे लाएँ§Ad frontem
Nach hinten§Send backward§Reculer§置后§Назад§पीछे भेजें§Ad tergum
Als Schaltung speichern …§Save as circuit …§Enregistrer comme circuit …§另存为电路 …§Сохранить как схему …§परिपथ के रूप में सहेजें …§Ut circuitum servare …
Diagramm bearbeiten …§Edit diagram …§Modifier le diagramme …§编辑图表 …§Изменить диаграмму …§आरेख संपादित करें …§Diagramma mutare …
Fixiert§Locked§Verrouillé§已固定§Закреплено§स्थिर§Fixum
Fixierte Bilder und PDF-Seiten lassen sich nicht versehentlich verschieben. Doppelklick wählt sie aus.§Locked images and PDF pages cannot be moved by accident. Double-click selects them.§Les images et pages PDF verrouillées ne bougent pas par erreur. Un double-clic les sélectionne.§固定的图片和 PDF 页面不会被意外移动。双击可选中。§Закреплённые изображения и страницы PDF не сдвинуть случайно. Двойной щелчок выделяет их.§स्थिर चित्र और PDF पृष्ठ गलती से नहीं खिसकते। डबल-क्लिक उन्हें चुनता है।§Imagines et paginae PDF fixae casu non moventur. Bis preme ut eligas.
An der Kante entlang zeichnen ergibt gerade Linien. Blauer Knopf dreht.§Drawing along the edge gives straight lines. Blue knob rotates.§Tracer le long du bord donne des droites. Le bouton bleu fait pivoter.§沿边缘绘制得到直线。蓝色旋钮旋转。§Рисование вдоль края даёт прямые. Синяя кнопка вращает.§किनारे के साथ खींचने पर सीधी रेखाएँ। नीला बटन घुमाता है।§Ad marginem ducens lineas rectas facis. Globulus caeruleus vertit.
Namen des Whiteboards ändern§Rename the whiteboard§Renommer le tableau§更改白板名称§Переименовать доску§व्हाइटबोर्ड का नाम बदलें§Nomen tabulae mutare
Präsentationsfenster für Beamer/zweiten Bildschirm öffnen§Open presentation window for projector/second screen§Ouvrir la fenêtre de présentation (projecteur/second écran)§打开演示窗口（投影仪/第二屏幕）§Открыть окно презентации для проектора/второго экрана§प्रोजेक्टर/दूसरी स्क्रीन के लिए प्रस्तुति विंडो खोलें§Fenestram praesentationis aperire (proiectorium/alterum scrinium)
Als PDF …§As PDF …§En PDF …§导出 PDF …§Как PDF …§PDF के रूप में …§Ut PDF …
Als PNG-Bild§As PNG image§En image PNG§导出 PNG 图片§Как изображение PNG§PNG चित्र के रूप में§Ut imago PNG
Speichern unter …§Save as …§Enregistrer sous …§另存为 …§Сохранить как …§इस रूप में सहेजें …§Servare ut …
Zur Übersicht§To overview§Vers l’aperçu§返回概览§К обзору§अवलोकन पर§Ad conspectum
Rückgängig (Strg+Z)§Undo (Ctrl+Z)§Annuler (Ctrl+Z)§撤销 (Ctrl+Z)§Отменить (Ctrl+Z)§पूर्ववत (Ctrl+Z)§Revocare (Ctrl+Z)
Wiederholen (Strg+Y)§Redo (Ctrl+Y)§Rétablir (Ctrl+Y)§重做 (Ctrl+Y)§Повторить (Ctrl+Y)§फिर करें (Ctrl+Y)§Iterare (Ctrl+Y)
Hilfslinien anzeigen (Art und Stärke in den Einstellungen)§Show guide lines (type and strength in settings)§Afficher les repères (type et intensité dans les réglages)§显示辅助线（类型和粗细见设置）§Показать вспомогательные линии (вид и насыщенность в настройках)§सहायक रेखाएँ दिखाएँ (प्रकार व गहराई सेटिंग्स में)§Lineas auxiliares monstrare (genus et robur in optionibus)
Vorlage wählen (historische Tafeln)§Choose template (historical boards)§Choisir un modèle (tableaux historiques)§选择模板（历史书写板）§Выбрать шаблон (исторические доски)§नमूना चुनें (ऐतिहासिक पट्टिकाएँ)§Exemplar eligere (tabulae historicae)
Vorlage§Template§Modèle§模板§Шаблон§नमूना§Exemplar
Heller Modus§Light mode§Mode clair§浅色模式§Светлая тема§हल्का मोड§Modus clarus
Dunkler Modus§Dark mode§Mode sombre§深色模式§Тёмная тема§गहरा मोड§Modus obscurus
Funktionen & Hilfe§Features & help§Fonctions & aide§功能与帮助§Функции и справка§सुविधाएँ व सहायता§Functiones & auxilium
Werkzeugleiste aufklappen§Expand toolbar§Déplier la barre d’outils§展开工具栏§Развернуть панель инструментов§टूलबार खोलें§Tabellam instrumentorum explicare
Werkzeugleiste minimieren§Minimise toolbar§Réduire la barre d’outils§最小化工具栏§Свернуть панель инструментов§टूलबार छोटा करें§Tabellam instrumentorum minuere
Leisten einblenden (Tab)§Show bars (Tab)§Afficher les barres (Tab)§显示工具栏 (Tab)§Показать панели (Tab)§पट्टियाँ दिखाएँ (Tab)§Tabellas monstrare (Tab)
Leisten ausblenden – ganze Fläche zum Schreiben (Tab)§Hide bars – full canvas for writing (Tab)§Masquer les barres – toute la surface pour écrire (Tab)§隐藏工具栏 – 全屏书写 (Tab)§Скрыть панели — всё поле для письма (Tab)§पट्टियाँ छिपाएँ – लिखने हेतु पूरी सतह (Tab)§Tabellas celare – tota superficies ad scribendum (Tab)
Vollbild beenden (F)§Exit full screen (F)§Quitter le plein écran (F)§退出全屏 (F)§Выйти из полноэкранного режима (F)§पूर्ण स्क्रीन बंद (F)§Plenum scrinium relinquere (F)
Vollbild (F)§Full screen (F)§Plein écran (F)§全屏 (F)§Полный экран (F)§पूर्ण स्क्रीन (F)§Plenum scrinium (F)
Alles anzeigen§Show all§Tout afficher§显示全部§Показать всё§सब दिखाएँ§Omnia monstrare
Verkleinern§Zoom out§Dézoomer§缩小§Уменьшить§छोटा करें§Minuere
Auf 100 % zurücksetzen§Reset to 100 %§Revenir à 100 %§重置为 100 %§Сбросить до 100 %§100 % पर रीसेट§Ad 100 % restituere
Vergrößern§Zoom in§Zoomer§放大§Увеличить§बड़ा करें§Augere
Leisten ausgeblendet. Werkzeuge per Taste (P, E, L …), Stifte mit 1–7. Tab blendet wieder ein.§Bars hidden. Tools via keys (P, E, L …), pens with 1–7. Tab shows them again.§Barres masquées. Outils au clavier (P, E, L …), stylos avec 1–7. Tab les réaffiche.§工具栏已隐藏。用按键选工具（P、E、L …），1–7 选笔。Tab 重新显示。§Панели скрыты. Инструменты клавишами (P, E, L …), перья 1–7. Tab — показать снова.§पट्टियाँ छिपीं। उपकरण कुंजियों से (P, E, L …), पेन 1–7 से। Tab फिर दिखाए।§Tabellae celatae. Instrumenta per litteras (P, E, L …), stili per 1–7. Tab rursus monstrat.
Vollbild ist hier nicht möglich. Alternativ F11 drücken.§Full screen is not possible here. Press F11 instead.§Plein écran impossible ici. Appuyez sur F11.§此处无法全屏。请改按 F11。§Полный экран здесь невозможен. Нажмите F11.§यहाँ पूर्ण स्क्रीन संभव नहीं। F11 दबाएँ।§Plenum scrinium hic fieri non potest. F11 preme.
Gezeichnete Schaltung berechnen und animieren§Compute and animate the drawn circuit§Calculer et animer le circuit dessiné§计算并动画显示所绘电路§Рассчитать и анимировать нарисованную схему§बनाए गए परिपथ की गणना व एनिमेशन§Circuitum pictum computare et movere
■ Stopp§■ Stop§■ Arrêt§■ 停止§■ Стоп§■ रोकें§■ Siste
▶ Simulieren§▶ Simulate§▶ Simuler§▶ 仿真§▶ Моделировать§▶ अनुकरण§▶ Simulare
Anleitung§Guide§Guide§指南§Руководство§मार्गदर्शिका§Ductus
Bauteile§Components§Composants§元件§Детали§घटक§Partes
Schaltungen§Circuits§Circuits§电路§Схемы§परिपथ§Circuitus
Bauteil suchen …§Search component …§Rechercher un composant …§搜索元件 …§Поиск детали …§घटक खोजें …§Partem quaerere …
Schaltung suchen …§Search circuit …§Rechercher un circuit …§搜索电路 …§Поиск схемы …§परिपथ खोजें …§Circuitum quaerere …
Neu laden§Reload§Recharger§重新加载§Перезагрузить§फिर लोड करें§Iterum onerare
Standardschaltungen§Standard circuits§Circuits standard§标准电路§Стандартные схемы§मानक परिपथ§Circuitus usitati
Eigene Schaltungen§Custom circuits§Circuits personnels§自定义电路§Свои схемы§अपने परिपथ§Circuitus proprii
Nichts gefunden.§Nothing found.§Rien trouvé.§未找到。§Ничего не найдено.§कुछ नहीं मिला।§Nihil inventum.
Auswahl als Schaltung speichern§Save selection as circuit§Enregistrer la sélection comme circuit§将所选内容保存为电路§Сохранить выделенное как схему§चयन को परिपथ के रूप में सहेजें§Electa ut circuitum servare
Symbol-Ordner öffnen§Open symbol folder§Ouvrir le dossier des symboles§打开符号文件夹§Открыть папку символов§प्रतीक फ़ोल्डर खोलें§Plicam signorum aperire
Schaltungs-Ordner öffnen§Open circuit folder§Ouvrir le dossier des circuits§打开电路文件夹§Открыть папку схем§परिपथ फ़ोल्डर खोलें§Plicam circuituum aperire
Symbole§Symbols§Symboles§符号§Символы§प्रतीक§Signa
keine Schaltung§not a circuit§pas un circuit§不是电路§не схема§परिपथ नहीं§non circuitus
Noch nichts Eigenes vorhanden.§Nothing custom yet.§Rien de personnel pour l’instant.§暂无自定义内容。§Пока ничего своего.§अभी कुछ अपना नहीं।§Nihil proprium adhuc.
Alle löschen§Delete all§Tout supprimer§全部删除§Удалить все§सब हटाएँ§Omnia delere
Markieren Sie zuerst die Teile der Schaltung (Rahmen aufziehen oder Strg+A).§First select the parts of the circuit (drag a frame or Ctrl+A).§Sélectionnez d’abord les éléments du circuit (cadre ou Ctrl+A).§请先选中电路部分（拖出选框或 Ctrl+A）。§Сначала выделите части схемы (рамкой или Ctrl+A).§पहले परिपथ के भाग चुनें (फ़्रेम खींचें या Ctrl+A)।§Primum partes circuitus elige (quadrum trahe vel Ctrl+A).
Schaltung speichern§Save circuit§Enregistrer le circuit§保存电路§Сохранить схему§परिपथ सहेजें§Circuitum servare
Name der Schaltung§Circuit name§Nom du circuit§电路名称§Название схемы§परिपथ का नाम§Nomen circuitus
Meine Schaltung§My circuit§Mon circuit§我的电路§Моя схема§मेरा परिपथ§Circuitus meus
Speichern§Save§Enregistrer§保存§Сохранить§सहेजें§Servare
Gespeichert unter „Eigene Schaltungen“.§Saved under “Custom circuits”.§Enregistré sous « Circuits personnels ».§已保存到“自定义电路”。§Сохранено в «Свои схемы».§“अपने परिपथ” में सहेजा गया।§Servatum sub «Circuitus proprii».
Speichern fehlgeschlagen (Speicher voll?)§Saving failed (storage full?)§Échec de l’enregistrement (stockage plein ?)§保存失败（存储已满？）§Не удалось сохранить (память заполнена?)§सहेजना विफल (संग्रहण भरा?)§Servare non successit (memoria plena?)
App installieren§Install app§Installer l’app§安装应用§Установить приложение§ऐप इंस्टॉल करें§Applicationem installare
Datei öffnen …§Open file …§Ouvrir un fichier …§打开文件 …§Открыть файл …§फ़ाइल खोलें …§Fasciculum aperire …
ⓘ Hilfe§ⓘ Help§ⓘ Aide§ⓘ 帮助§ⓘ Справка§ⓘ सहायता§ⓘ Auxilium
Zuletzt verwendet§Recently used§Utilisés récemment§最近使用§Недавние§हाल में उपयोग किए गए§Nuper adhibita
Noch keine Whiteboards. Beginnen Sie mit „Neues Whiteboard“.§No whiteboards yet. Start with “New whiteboard”.§Aucun tableau pour l’instant. Commencez par « Nouveau tableau ».§还没有白板。请点击“新建白板”开始。§Досок пока нет. Начните с «Новая доска».§अभी कोई व्हाइटबोर्ड नहीं। “नया व्हाइटबोर्ड” से शुरू करें।§Nullae tabulae adhuc. Incipe a «Nova tabula».
Alle Funktionen erklärt§All features explained§Toutes les fonctions expliquées§全部功能说明§Все функции с пояснениями§सभी सुविधाएँ समझाई गईं§Omnes functiones explicatae
Koordinatensystem§Coordinate system§Repère§坐标系§Система координат§निर्देशांक तंत्र§Systema coordinatarum
Formeln zwischen $…$, z. B. $U = R \\cdot I$§Formulas between $…$, e.g. $U = R \\cdot I$§Formules entre $…$, p. ex. $U = R \\cdot I$§公式写在 $…$ 之间，例如 $U = R \\cdot I$§Формулы между $…$, напр. $U = R \\cdot I$§सूत्र $…$ के बीच, जैसे $U = R \\cdot I$§Formulae inter $…$, e.g. $U = R \\cdot I$
Formeln zwischen $…$, z. B. $U_C$ / V. Später per Doppelklick änderbar.§Formulas between $…$, e.g. $U_C$ / V. Can be changed later by double-clicking.§Formules entre $…$, p. ex. $U_C$ / V. Modifiable ensuite par double-clic.§公式写在 $…$ 之间，例如 $U_C$ / V。之后可双击修改。§Формулы между $…$, напр. $U_C$ / V. Позже можно изменить двойным щелчком.§सूत्र $…$ के बीच, जैसे $U_C$ / V। बाद में डबल-क्लिक से बदलें।§Formulae inter $…$, e.g. $U_C$ / V. Postea bis premendo mutari possunt.
Whiteboard-Datei speichern (.owb)§Save whiteboard file (.owb)§Enregistrer le fichier du tableau (.owb)§保存白板文件 (.owb)§Сохранить файл доски (.owb)§व्हाइटबोर्ड फ़ाइल सहेजें (.owb)§Fasciculum tabulae servare (.owb)
Strg+S§Ctrl+S§Ctrl+S§Ctrl+S§Ctrl+S§Ctrl+S§Ctrl+S
Whiteboard-Datei speichern (.owb)	Strg+S§Save whiteboard file (.owb)	Ctrl+S§Enregistrer le fichier du tableau (.owb)	Ctrl+S§保存白板文件 (.owb)	Ctrl+S§Сохранить файл доски (.owb)	Ctrl+S§व्हाइटबोर्ड फ़ाइल सहेजें (.owb)	Ctrl+S§Fasciculum tabulae servare (.owb)	Ctrl+S
Sprache / Language§Language / Sprache§Langue / Language§语言 / Language§Язык / Language§भाषा / Language§Lingua / Language
`;

/* Dynamische Texte: $1, $2 … werden eingesetzt (und, falls möglich, selbst übersetzt) */
const I18N_PATTERNS = [
  [/^PDF wird eingefügt … Seite (\d+) \((\d+) von (\d+)\)$/, { en: 'Inserting PDF … page $1 ($2 of $3)', fr: 'Insertion du PDF … page $1 ($2 sur $3)', zh: '正在插入 PDF … 第 $1 页（$2 / $3）', ru: 'Вставка PDF … страница $1 ($2 из $3)', hi: 'PDF डाला जा रहा है … पृष्ठ $1 ($3 में से $2)', la: 'PDF inseritur … pagina $1 ($2 ex $3)' }],
  [/^„(.+)“ ist keine gültige Seitenangabe\.$/, { en: '“$1” is not a valid page range.', fr: '« $1 » n’est pas une indication de page valide.', zh: '“$1”不是有效的页码。', ru: '«$1» — неверный диапазон страниц.', hi: '“$1” मान्य पृष्ठ सीमा नहीं है।', la: '«$1» paginae indicatio non valet.' }],
  [/^Das PDF hat nur (\d+) Seiten?\.$/, { en: 'The PDF has only $1 page(s).', fr: 'Le PDF ne compte que $1 page(s).', zh: '该 PDF 只有 $1 页。', ru: 'В PDF всего $1 стр.', hi: 'PDF में केवल $1 पृष्ठ हैं।', la: 'PDF tantum $1 paginas habet.' }],
  [/^(\d+) Seiten? auf (\d+) Board-Seiten?$/, { en: '$1 page(s) on $2 board page(s)', fr: '$1 page(s) sur $2 page(s) du tableau', zh: '$1 页，分布在 $2 个白板页', ru: '$1 стр. на $2 стр. доски', hi: '$2 बोर्ड पृष्ठों पर $1 पृष्ठ', la: '$1 paginae in $2 paginis tabulae' }],
  [/^(\d+) Seiten?$/, { en: '$1 page(s)', fr: '$1 page(s)', zh: '$1 页', ru: '$1 стр.', hi: '$1 पृष्ठ', la: '$1 paginae' }],
  [/^„(.+)“ hat (\d+) Seiten?\.$/, { en: '“$1” has $2 page(s).', fr: '« $1 » compte $2 page(s).', zh: '“$1”共 $2 页。', ru: '«$1»: $2 стр.', hi: '“$1” में $2 पृष्ठ हैं।', la: '«$1» $2 paginas habet.' }],
  [/^(\d+) Seiten einfügen\? Das kann eine Weile dauern\.$/, { en: 'Insert $1 pages? This may take a while.', fr: 'Insérer $1 pages ? Cela peut prendre un moment.', zh: '插入 $1 页？这可能需要一些时间。', ru: 'Вставить $1 страниц? Это может занять время.', hi: '$1 पृष्ठ डालें? इसमें समय लग सकता है।', la: '$1 paginas inserere? Diutius durare potest.' }],
  [/^„(.+)“ konnte nicht geladen werden\.$/, { en: '“$1” could not be loaded.', fr: 'Impossible de charger « $1 ».', zh: '无法加载“$1”。', ru: 'Не удалось загрузить «$1».', hi: '“$1” लोड नहीं हो सका।', la: '«$1» aperiri non potuit.' }],
  [/^PDF wird erstellt … Seite (\d+) von (\d+)$/, { en: 'Creating PDF … page $1 of $2', fr: 'Création du PDF … page $1 sur $2', zh: '正在生成 PDF … 第 $1 / $2 页', ru: 'Создание PDF … страница $1 из $2', hi: 'PDF बन रहा है … पृष्ठ $1 / $2', la: 'PDF fit … pagina $1 ex $2' }],
  [/^„(.+)“ wirklich löschen\? Das lässt sich nicht rückgängig machen\.$/, { en: 'Really delete “$1”? This cannot be undone.', fr: 'Supprimer vraiment « $1 » ? Action irréversible.', zh: '确定删除“$1”？此操作无法撤销。', ru: 'Удалить «$1»? Это нельзя отменить.', hi: 'क्या सचमुच “$1” हटाएँ? यह पूर्ववत नहीं होगा।', la: 'Visne vere «$1» delere? Revocari non potest.' }],
  [/^Grundfrequenz f₁ = 1\/T = (.+)$/, { en: 'Fundamental f₁ = 1/T = $1', fr: 'Fréquence fondamentale f₁ = 1/T = $1', zh: '基频 f₁ = 1/T = $1', ru: 'Основная частота f₁ = 1/T = $1', hi: 'मूल आवृत्ति f₁ = 1/T = $1', la: 'Frequentia fundamentalis f₁ = 1/T = $1' }],
  [/^Seite (\d+) mit allem Inhalt löschen\?$/, { en: 'Delete page $1 with all its content?', fr: 'Supprimer la page $1 et tout son contenu ?', zh: '删除第 $1 页及其全部内容？', ru: 'Удалить страницу $1 со всем содержимым?', hi: 'पृष्ठ $1 सारी सामग्री सहित हटाएँ?', la: 'Paginam $1 cum toto contento delere?' }],
  [/^(\d+) eigene Symbole geladen\.$/, { en: '$1 custom symbols loaded.', fr: '$1 symboles personnels chargés.', zh: '已加载 $1 个自定义符号。', ru: 'Загружено своих символов: $1.', hi: '$1 अपने प्रतीक लोड हुए।', la: '$1 signa propria onerata.' }],
  [/^(.+) eingefügt – ein Objekt zum Verschieben und Skalieren\. Doppelklick bearbeitet\.$/, { en: '$1 inserted – one object to move and scale. Double-click to edit.', fr: '$1 inséré – un objet à déplacer et redimensionner. Double-clic pour modifier.', zh: '已插入$1 – 作为一个整体移动和缩放。双击编辑。', ru: '$1 вставлено — один объект для перемещения и масштабирования. Двойной щелчок — правка.', hi: '$1 डाला गया – खिसकाने व स्केल करने हेतु एक वस्तु। संपादन हेतु डबल-क्लिक।', la: '$1 insertum – unum obiectum movendum et scalandum. Bis preme ut mutes.' }],
  [/^(.+) eingefügt\. Alles ist ausgewählt und lässt sich verschieben\.$/, { en: '$1 inserted. Everything is selected and can be moved.', fr: '$1 inséré. Tout est sélectionné et peut être déplacé.', zh: '已插入$1。全部已选中，可移动。', ru: '$1 вставлено. Всё выделено и может быть перемещено.', hi: '$1 डाला गया। सब चयनित है और खिसकाया जा सकता है।', la: '$1 insertum. Omnia electa sunt et moveri possunt.' }],
  [/^Nicht simuliert: (.+)$/, { en: 'Not simulated: $1', fr: 'Non simulé : $1', zh: '未仿真：$1', ru: 'Не моделируется: $1', hi: 'अनुकरण नहीं: $1', la: 'Non simulatum: $1' }],
  [/^Die Schaltung enthält Bauteile, die mit vereinfachten Modellen berechnet werden: (.+)\.$/, { en: 'The circuit contains components computed with simplified models: $1.', fr: 'Le circuit contient des composants calculés avec des modèles simplifiés : $1.', zh: '电路包含使用简化模型计算的元件：$1。', ru: 'Схема содержит детали, рассчитываемые по упрощённым моделям: $1.', hi: 'परिपथ में सरल मॉडलों से गणना होने वाले घटक हैं: $1।', la: 'Circuitus partes continet exemplaribus simplicibus computatas: $1.' }],
  [/^Gespeichert: (.+)$/, { en: 'Saved: $1', fr: 'Enregistré : $1', zh: '已保存：$1', ru: 'Сохранено: $1', hi: 'सहेजा गया: $1', la: 'Servatum: $1' }],
  [/^Speichern fehlgeschlagen: (.+)$/, { en: 'Saving failed: $1', fr: 'Échec de l’enregistrement : $1', zh: '保存失败：$1', ru: 'Ошибка сохранения: $1', hi: 'सहेजना विफल: $1', la: 'Servare non successit: $1' }],
  [/^Geändert: (.+)$/, { en: 'Modified: $1', fr: 'Modifié : $1', zh: '修改于：$1', ru: 'Изменено: $1', hi: 'बदला गया: $1', la: 'Mutatum: $1' }],
  [/^„(.+)“: Klick setzt ab, Q dreht, Esc bricht ab\.$/, { en: '“$1”: click places, Q rotates, Esc cancels.', fr: '« $1 » : clic pour poser, Q pivote, Échap annule.', zh: '“$1”：点击放置，Q 旋转，Esc 取消。', ru: '«$1»: щелчок — поставить, Q — повернуть, Esc — отмена.', hi: '“$1”: क्लिक से रखें, Q घुमाए, Esc रद्द।', la: '«$1»: preme ut ponas, Q vertit, Esc abrogat.' }],
  [/^„(.+)“: Klick setzt, Q dreht, Esc beendet\.$/, { en: '“$1”: click places, Q rotates, Esc finishes.', fr: '« $1 » : clic pour placer, Q pivote, Échap termine.', zh: '“$1”：点击放置，Q 旋转，Esc 结束。', ru: '«$1»: щелчок — поставить, Q — повернуть, Esc — завершить.', hi: '“$1”: क्लिक से रखें, Q घुमाए, Esc समाप्त।', la: '«$1»: preme ut ponas, Q vertit, Esc finit.' }],
  [/^Eigene (.+) löschen$/, { en: 'Delete custom $1', fr: 'Supprimer les $1 personnels', zh: '删除自定义$1', ru: 'Удалить свои $1', hi: 'अपने $1 हटाएँ', la: '$1 propria delere' }],
  [/^Alle selbst hinzugefügten (.+) entfernen\?$/, { en: 'Remove all custom $1?', fr: 'Retirer tous les $1 ajoutés ?', zh: '移除所有自行添加的$1？', ru: 'Удалить все добавленные $1?', hi: 'सभी जोड़े गए $1 हटाएँ?', la: 'Omnia $1 addita removere?' }],
  [/^(\d+) Datei\(en\) importiert\.$/, { en: '$1 file(s) imported.', fr: '$1 fichier(s) importé(s).', zh: '已导入 $1 个文件。', ru: 'Импортировано файлов: $1.', hi: '$1 फ़ाइल(ें) आयात हुईं।', la: '$1 fasciculi importati.' }],
  [/^(.+) importieren …$/, { en: 'Import $1 …', fr: 'Importer des $1 …', zh: '导入$1 …', ru: 'Импорт: $1 …', hi: '$1 आयात करें …', la: '$1 importare …' }],
  [/^„(.+)“ ist keine gültige Datei\.$/, { en: '“$1” is not a valid file.', fr: '« $1 » n’est pas un fichier valide.', zh: '“$1”不是有效文件。', ru: '«$1» — недопустимый файл.', hi: '“$1” मान्य फ़ाइल नहीं है।', la: '«$1» fasciculus validus non est.' }],
  [/^Fehler in Symbol-Datei: (.+)$/, { en: 'Error in symbol file: $1', fr: 'Erreur dans le fichier de symboles : $1', zh: '符号文件错误：$1', ru: 'Ошибка в файле символов: $1', hi: 'प्रतीक फ़ाइल में त्रुटि: $1', la: 'Error in fasciculo signorum: $1' }],
  [/^(\d+) Objekte$/, { en: '$1 objects', fr: '$1 objets', zh: '$1 个对象', ru: 'Объектов: $1', hi: '$1 वस्तुएँ', la: '$1 obiecta' }],
  [/^Tafel (\S+) anzeigen \(Bild ↑\/↓\)$/, { en: 'Show tablet $1 (Page ↑/↓)', fr: 'Afficher la tablette $1 (Pg ↑/↓)', zh: '显示蜡板 $1 (Page ↑/↓)', ru: 'Показать табличку $1 (PgUp/PgDn)', hi: 'पट्टिका $1 दिखाएँ (Page ↑/↓)', la: 'Tabulam $1 monstrare (Page ↑/↓)' }],
  [/^Radius:$/, { en: 'Radius:', fr: 'Rayon :', zh: '半径：', ru: 'Радиус:', hi: 'त्रिज्या:', la: 'Radius:' }],
  [/^(.+) \(Strom\)$/, { en: '$1 (current)', fr: '$1 (courant)', zh: '$1（电流）', ru: '$1 (ток)', hi: '$1 (धारा)', la: '$1 (currens)' }],
  [/^(.+) \(Spannung\)$/, { en: '$1 (voltage)', fr: '$1 (tension)', zh: '$1（电压）', ru: '$1 (напряжение)', hi: '$1 (वोल्टेज)', la: '$1 (tensio)' }],
  [/^\(Strom\)$/, { en: '(current)', fr: '(courant)', zh: '（电流）', ru: '(ток)', hi: '(धारा)', la: '(currens)' }],
  [/^\(Spannung\)$/, { en: '(voltage)', fr: '(tension)', zh: '（电压）', ru: '(напряжение)', hi: '(वोल्टेज)', la: '(tensio)' }],
  [/^Unerwartetes Zeichen bei „(.*)“$/, { en: 'Unexpected character at “$1”', fr: 'Caractère inattendu à « $1 »', zh: '“$1”处有意外字符', ru: 'Неожиданный символ у «$1»', hi: '“$1” पर अप्रत्याशित वर्ण', la: 'Signum inexspectatum ad «$1»' }],
  [/^Unbekannt: „(.*)“ \(erlaubt: (.*)\)$/, { en: 'Unknown: “$1” (allowed: $2)', fr: 'Inconnu : « $1 » (autorisé : $2)', zh: '未知：“$1”（可用：$2）', ru: 'Неизвестно: «$1» (можно: $2)', hi: 'अज्ञात: “$1” (अनुमत: $2)', la: 'Ignotum: «$1» (licent: $2)' }],
  [/^(.+) \((\d)\)$/, { en: '$1 ($2)', fr: '$1 ($2)', zh: '$1 ($2)', ru: '$1 ($2)', hi: '$1 ($2)', la: '$1 ($2)' }],
  [/^Unerwartet: „(.*)“$/, { en: 'Unexpected: “$1”', fr: 'Inattendu : « $1 »', zh: '意外：“$1”', ru: 'Неожиданно: «$1»', hi: 'अप्रत्याशित: “$1”', la: 'Inexspectatum: «$1»' }]
];
