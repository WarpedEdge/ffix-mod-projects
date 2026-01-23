using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Status
{
    [StatusScript(BattleStatusId.CustomStatus26)]
    public sealed class PunisherModeStatusScript : CloudModeStatusScriptBase
    {
        // Punisher flips the badge to "P" so the player knows the damage trade-offs are live.
        protected override string IconText => "P";
        protected override BattleStatusId ThisStatusId => BattleStatusId.CustomStatus26;
        protected override BattleStatusId OppositeStatusId => BattleStatusId.CustomStatus25;

        protected override void OnApplied()
        {
            if (Target == null)
                return;

            // Punisher should stand on its own, so clear the counter guard flag when we swap in.
            Target.RemoveStatus(BattleStatus.CustomStatus27);
            Target.RemoveStatus(BattleStatus.Defend);
        }

        protected override void OnRemoved()
        {
            if (Target == null)
                return;

            // Dropping Punisher releases the defend pose so Operator can take over cleanly.
            Target.RemoveStatus(BattleStatus.Defend);
        }
    }
}
