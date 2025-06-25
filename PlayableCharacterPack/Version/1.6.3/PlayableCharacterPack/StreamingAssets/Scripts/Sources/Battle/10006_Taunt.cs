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
		
		private static HashSet<UInt16> TauntedList = new HashSet<UInt16>();

        public TauntScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			Int32 atkCounter = _v.Command.HitRate;
			if (atkCounter <= 0)
				return;
			if (TauntedList.Contains(_v.Target.Id)) // The target has already been taunted, maybe by someone else
				return;
			TauntedList.Add(_v.Target.Id);
			
			// Create as many SPS as there are taunting counters
			List<SPSEffect> spsList = new List<SPSEffect>();
			for (Int32 i = 0; i < atkCounter; i++)
				spsList.Add(AddSPS());
			
			// Apply the taunting routine
			BattleUnit taunter = _v.Caster;
			_v.Target.AddDelayedModifier(
				target =>
				{
					if (FF9StateSystem.Battle.FF9Battle.btl_phase >= FF9StateBattleSystem.PHASE_VICTORY) // End the effect at the end of battles (or during cutscenes), mainly to purge the TauntedList
						return false;
					for (Int32 i = 0; i < spsList.Count; i++)
					{
						SPSEffect sps = spsList[i];
						if (sps != null)
						{
							// Move the SPS around the taunted's head
							Double angle = (i * 360f / spsList.Count + RealTime.time * 30f) * Math.PI / 180;
							btl2d.GetIconPosition(target, btl2d.ICON_POS_FOREHEAD, out Transform attachment, out Vector3 iconOff);
							sps.pos = attachment.position + new Vector3((Single)(150f * Math.Cos(angle)), 100f, (Single)(150f * Math.Sin(angle)));
							if (target.IsDisappear)
								sps.attr &= unchecked((Byte)~SPSConst.ATTR_UPDATE_ANY_FRAME);
							else
								sps.attr |= SPSConst.ATTR_UPDATE_ANY_FRAME;
						}
					}
					if (!taunter.IsTargetable || taunter.IsUnderAnyStatus(BattleStatus.Death)) // Cancel the effect if the taunter died
						return false;
					
					// List all the commands susceptible to have their target redirected, starting from currently performing commands
					List<CMD_DATA> cmdList = new List<CMD_DATA>();
					foreach (CMD_DATA cmd in FF9StateSystem.Battle.FF9Battle.cur_cmd_list)
						if (CheckCommand(cmd, target, taunter))
							cmdList.Add(cmd);
					for (CMD_DATA cmd = FF9StateSystem.Battle.FF9Battle.cmd_queue.next; cmd != null; cmd = cmd.next)
						if (CheckCommand(cmd, target, taunter))
							cmdList.Add(cmd);
					while (cmdList.Count > 0 && atkCounter > 0)
					{
						// Redirect the target to the taunter and remove a SPS
						cmdList[0].tar_id = taunter.Id;
						cmdList.RemoveAt(0);
						atkCounter--;
						if (atkCounter < spsList.Count)
						{
							if (spsList[atkCounter] != null)
								spsList[atkCounter].Unload();
							spsList.RemoveAt(atkCounter);
						}
					}
					return atkCounter > 0;
				},
				target =>
				{
					TauntedList.Remove(target.Id);
					foreach (SPSEffect sps in spsList)
						if (sps != null)
							sps.Unload();
					spsList.Clear();
				}
			);
        }
		
		// The condition for a command to be susceptible to taunting
		private Boolean CheckCommand(CMD_DATA cmd, BattleUnit user, BattleUnit taunter)
		{
			return cmd.regist.btl_id == user.Id && cmd.tar_id != taunter.Id && Comn.countBits(cmd.tar_id) == 1 && btl_scrp.FindBattleUnit(cmd.tar_id)?.IsPlayer == taunter.IsPlayer;
		}
		
		private SPSEffect AddSPS()
		{
			SPSEffect sps = HonoluluBattleMain.battleSPS.AddSequenceSPS(7, -1, 1f, true);
			if (sps == null)
				return null;
			sps.attr = SPSConst.ATTR_VISIBLE | SPSConst.ATTR_UPDATE_ANY_FRAME;
			return sps;
		}
    }
}
