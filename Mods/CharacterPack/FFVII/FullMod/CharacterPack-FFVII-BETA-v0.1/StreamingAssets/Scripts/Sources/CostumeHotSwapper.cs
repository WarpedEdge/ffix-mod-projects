using Assets.Sources.Scripts.UI.Common;
using Memoria.Data;

namespace Memoria.QualityOfLifa
{
    public class OverloadedPlayerUI : IOverloadPlayerUIScript
    {
        public IOverloadPlayerUIScript.Result UpdatePointStatus(PLAYER player)
        {
            IOverloadPlayerUIScript.Result result = new IOverloadPlayerUIScript.Result();
            result.ColorHP = (player.cur.hp == 0) ? FF9TextTool.Red
                           : (player.cur.hp <= player.max.hp / 6) ? FF9TextTool.Yellow : FF9TextTool.White;
            result.ColorMP = (player.cur.mp <= player.max.mp / 6) ? FF9TextTool.Yellow : FF9TextTool.White;
            result.ColorMagicStone = (player.cur.capa == 0) ? FF9TextTool.Yellow : FF9TextTool.White;

			// This condition checks only for Cloud.
            if (player.info.serial_no >= (CharacterSerialNumber)57 && player.info.serial_no <= (CharacterSerialNumber)81)
                ff9play.FF9Play_UpdateSerialNumber(player);

            return result;
        }
    }
}