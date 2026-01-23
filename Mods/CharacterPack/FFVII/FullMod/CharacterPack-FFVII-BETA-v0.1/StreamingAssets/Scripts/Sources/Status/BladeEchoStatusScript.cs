using System;
using FF9;
using Memoria.Data;

namespace Memoria.Scripts.Status
{
    [StatusScript(BattleStatusId.CustomStatus29)]
    public sealed class BladeEchoStatusScript : StatusScriptBase, IFinishCommandScript
    {
        private const Int32 FollowupScriptId = 11012;
        private const BattleAbilityId BladeBeamAbilityId = (BattleAbilityId)11085;
        private UInt16 _sourceId;

        public override UInt32 Apply(BattleUnit target, BattleUnit inflicter, params object[] parameters)
        {
            base.Apply(target, inflicter, parameters);

            if (parameters != null && parameters.Length > 0)
                _sourceId = Convert.ToUInt16(parameters[0]);
            else if (inflicter != null)
                _sourceId = inflicter.Id;

            return btl_stat.ALTER_SUCCESS;
        }

        public void OnFinishCommand(CMD_DATA cmd, Int32 tranceDecrease)
        {
            if (Target == null || cmd == null || cmd.regist != Target.Data)
                return;
            if (!Target.IsUnderAnyStatus(BattleStatus.CustomStatus29))
                return;

            TriggerFollowup();
            Target.RemoveStatus(BattleStatus.CustomStatus29);
        }

        public override Boolean Remove()
        {
            return true;
        }

        private void TriggerFollowup()
        {
            BattleUnit source = btl_scrp.FindBattleUnit(_sourceId);
            if (source == null || source.CurrentHp == 0)
            {
                foreach (BattleUnit unit in BattleState.EnumerateUnits())
                {
                    if (unit.IsPlayer && unit.IsTargetable && unit.CurrentHp > 0)
                    {
                        source = unit;
                        break;
                    }
                }
            }

            if (source == null)
                return;

            UInt16 targetIds = 0;
            foreach (BattleUnit unit in BattleState.EnumerateUnits())
            {
                if (!unit.IsTargetable || unit.CurrentHp == 0)
                    continue;
                if (unit.IsPlayer == source.IsPlayer)
                    continue;

                targetIds |= unit.Id;
            }

            if (targetIds != 0)
            {
                CMD_DATA followup = new CMD_DATA();
                btl_cmd.ClearCommand(followup);
                btl_cmd.ClearReflecData(followup);
                followup.regist = source.Data;
                uint cursor = (Comn.countBits(targetIds) > 1) ? 1u : 0u;
                btl_cmd.SetCommand(followup, BattleCommandId.ScriptCounter1, (Int32)BladeBeamAbilityId, targetIds, cursor, forcePriority: true);
                followup.info.cmd_motion = false;
            }
        }

    }
}
