using System;
using System.Collections.Generic;
using Memoria.Data;
using FF9;
using UnityEngine;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Taunt: force the enemy to target the user for their next attack(s)
    /// </summary>
    [BattleScript(Id)]
    public sealed class TauntScript : IBattleScript
    {
        public const Int32 Id = 10006;
		
        private readonly BattleCalculator _v;

        public TauntScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			Int32 atkCounter = _v.Command.HitRate;
			if (atkCounter <= 0)
				return;
			SPSEffect sps = AddSPS();
			BattleUnit taunter = _v.Caster;
			_v.Target.AddDelayedModifier(
				target =>
				{
					if (sps != null)
					{
						btl2d.GetIconPosition(target, btl2d.ICON_POS_FOREHEAD, out Transform attachment, out Vector3 iconOff);
						sps.pos = attachment.position + iconOff;
						if (target.IsDisappear)
							sps.attr &= unchecked((Byte)~SPSConst.ATTR_UPDATE_ANY_FRAME);
						else
							sps.attr |= SPSConst.ATTR_UPDATE_ANY_FRAME;
					}
					if (!taunter.IsTargetable || taunter.IsUnderAnyStatus(BattleStatus.Death))
						return false;
					List<CMD_DATA> cmdList = new List<CMD_DATA>();
					foreach (CMD_DATA cmd in FF9StateSystem.Battle.FF9Battle.cur_cmd_list)
						if (CheckCommand(cmd, target, taunter))
							cmdList.Add(cmd);
					for (CMD_DATA cmd = FF9StateSystem.Battle.FF9Battle.cmd_queue.next; cmd != null; cmd = cmd.next)
						if (CheckCommand(cmd, target, taunter))
							cmdList.Add(cmd);
					while (cmdList.Count > 0 && atkCounter > 0)
					{
						cmdList[0].tar_id = taunter.Id;
						cmdList.RemoveAt(0);
						atkCounter--;
					}
					return atkCounter > 0;
				},
				target =>
				{
					if (sps != null)
						sps.Unload();
				}
			);
        }
		
		private Boolean CheckCommand(CMD_DATA cmd, BattleUnit user, BattleUnit taunter)
		{
			return cmd.regist.btl_id == user.Id && cmd.tar_id != taunter.Id && Comn.countBits(cmd.tar_id) == 1 && btl_scrp.FindBattleUnit(cmd.tar_id)?.IsPlayer == taunter.IsPlayer;
		}
		
		private SPSEffect AddSPS()
		{
			SPSEffect sps = HonoluluBattleMain.battleSPS.AddSequenceSPS(7, -1, 1f, true);
			if (sps == null)
				return null;
			sps.scale = (Int32)(sps.scale * 1.5f);
			sps.attr = SPSConst.ATTR_VISIBLE | SPSConst.ATTR_UPDATE_ANY_FRAME;
			return sps;
		}
    }
}
