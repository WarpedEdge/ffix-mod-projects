using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Status
{
    [StatusScript(BattleStatusId.CustomStatus25)]
    public sealed class OperatorModeStatusScript : CloudModeStatusScriptBase
    {
        // Operator is the default stance: simple "O" icon.
        protected override string IconText => "O";
        protected override BattleStatusId ThisStatusId => BattleStatusId.CustomStatus25;
        protected override BattleStatusId OppositeStatusId => BattleStatusId.CustomStatus26;

        protected override void OnRemoved()
        {
            // Leaving Operator wipes any leftover guard pose for Punisher 
            Target?.RemoveStatus(BattleStatus.CustomStatus27);
            Target?.RemoveStatus(BattleStatus.Defend);
        }
    }
}
