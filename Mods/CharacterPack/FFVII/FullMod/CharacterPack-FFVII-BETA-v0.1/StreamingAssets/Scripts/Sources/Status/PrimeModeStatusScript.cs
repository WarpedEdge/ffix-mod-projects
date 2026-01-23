using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Status
{
    [StatusScript(BattleStatusId.CustomStatus28)]
    public sealed class PrimeModeStatusScript : CloudModeStatusScriptBase
    {
        protected override string IconText => "P+";
        protected override BattleStatusId ThisStatusId => BattleStatusId.CustomStatus28;
        protected override BattleStatusId OppositeStatusId => BattleStatusId.CustomStatus25;

        protected override void OnApplied()
        {
            if (Target == null)
                return;

            Target.RemoveStatus(BattleStatus.CustomStatus26);
            Target.RemoveStatus(BattleStatus.CustomStatus27);
            Target.RemoveStatus(BattleStatus.Defend);
        }

        protected override void OnRemoved()
        {
            if (Target == null)
                return;

            Target.RemoveStatus(BattleStatus.Defend);
        }
    }
}
