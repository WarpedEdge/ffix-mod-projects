using System;
using Memoria.Data;

namespace Memoria.Scripts.Overloads
{
    // Cancels the next action for units afflicted by Paralyzed, wasting one turn.
    public sealed class ParalyzedSkipTurnScript : IOverloadOnCommandRunScript
    {
        public Boolean OnCommandRun(BattleCommand cmd)
        {
            if (cmd == null)
                return false;

            BattleUnit caster = cmd.Caster;
            if (caster == null)
                return false;

            if (!caster.IsUnderAnyStatus(BattleStatus.CustomStatus24))
                return false;

            cmd.Data.tar_id = 0;
            caster.KillCommand(cmd, true);
            caster.CurrentAtb = 0;
            TriggerFinishHooks(cmd, caster);
            caster.RemoveStatus(BattleStatus.CustomStatus24);
            return true;
        }

        private static void TriggerFinishHooks(BattleCommand cmd, BattleUnit caster)
        {
            if (cmd == null || caster == null)
                return;

            foreach (BattleStatusId statusId in caster.CurrentStatus.ToStatusList())
            {
                if (caster.Data.stat.effects.TryGetValue(statusId, out var script))
                    (script as IFinishCommandScript)?.OnFinishCommand(cmd, 0);
            }
        }
    }
}
