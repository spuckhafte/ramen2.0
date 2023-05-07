var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const nums = ['1', '2', '3', '4', '5'];
    const colors = ['white', 'black'];
    const locations = ['forest', 'dango', 'gate'];
    const report = (_a = msg.embeds[0].description) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const num = nums.find(i => report.includes(i));
    const color = colors.find(i => report.includes(i));
    const location = locations.find(i => report.includes(i));
    yield msg.reply(`**Hint: __\`${num} ${color} ${location}\`__**`);
});
