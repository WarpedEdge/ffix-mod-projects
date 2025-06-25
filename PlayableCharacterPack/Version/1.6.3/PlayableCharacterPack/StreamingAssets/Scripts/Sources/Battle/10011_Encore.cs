using System;
using System.Collections.Generic;
using Memoria.Data;
using FF9;

namespace Memoria.Scripts.Battle
{
	/// <summary>
	/// Encore: make the character perform their next action twice
	/// </summary>
	[BattleScript(Id)]
	public sealed class EncoreScript : IBattleScript
	{
		public const Int32 Id = 10011;

		private readonly BattleCalculator _v;

		public EncoreScript(BattleCalculator v)
		{
			_v = v;
		}

		public void Perform()
		{
			if (_v.Target.IsUnderAnyStatus(BattleStatusConst.CannotAct))
			{
				_v.Context.Flags |= BattleCalcFlags.Miss;
				return;
			}
			btl2d.Btl2dReqSymbolMessage(_v.Target, "[00FFFF]", _v.Command.AbilityName, HUDMessage.MessageStyle.DAMAGE, 12);
			_v.Target.AddDelayedModifier(
				target =>
				{
					if (target.IsUnderAnyStatus(BattleStatus.Jump | BattleStatus.Death | BattleStatus.Petrify | BattleStatus.Venom))
						return false;
					if (btl_util.IsBtlUsingCommand(target, out CMD_DATA cmd))
						return !IsCommandValid(cmd);
					return true;
				},
				target =>
				{
					if (target.IsUnderAnyStatus(BattleStatusConst.CannotAct))
						return;
					if (!btl_util.IsBtlUsingCommand(target, out CMD_DATA cmd))
						return;
					if (IsCommandValid(cmd))
						BattleState.EnqueueCounter(target, cmd.cmd_no, (BattleAbilityId)cmd.sub_no, cmd.tar_id);
				}
			);
		}
		
		private Boolean IsCommandValid(CMD_DATA cmd)
		{
			return cmd.regist != null && cmd == cmd.regist.cmd[0] && cmd.ScriptId != EncoreScript.Id && cmd.cmd_no != BattleCommandId.Jump && cmd.cmd_no != BattleCommandId.JumpInTrance && cmd.cmd_no != BattleCommandId.Defend && cmd.cmd_no != BattleCommandId.Change && cmd.cmd_no != BattleCommandId.Item && cmd.cmd_no != BattleCommandId.Throw && cmd.cmd_no != BattleCommandId.AutoPotion && (cmd.cmd_no < BattleCommandId.SysEscape || cmd.cmd_no > BattleCommandId.SysStone);
		}
	}
}