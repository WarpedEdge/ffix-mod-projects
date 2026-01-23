using System;
using Memoria;
using Memoria.Data;
using UnityEngine;

namespace Memoria.Scripts.Status
{
    // Shared bits for both modes: keeps mutual exclusivity between Cloud modes.
    public abstract class CloudModeStatusScriptBase : StatusScriptBase
    {
        private const Single IconVerticalOffset = 180f; // Raise this number to lift the stance icon higher; lower it to do the opposite.
        private static readonly BattleStatusId[] ModeStatuses =
        {
            BattleStatusId.CustomStatus25, // OperatorMode
            BattleStatusId.CustomStatus26, // PunisherMode
            BattleStatusId.CustomStatus28  // PrimeMode
        };
        protected abstract String IconText { get; }
        protected abstract BattleStatusId ThisStatusId { get; }
        protected abstract BattleStatusId OppositeStatusId { get; }

        public override UInt32 Apply(BattleUnit target, BattleUnit inflicter, params object[] parameters)
        {
            base.Apply(target, inflicter, parameters);

            ClearOtherModes(target);

            OnApplied();

            return btl_stat.ALTER_SUCCESS;
        }

        public override Boolean Remove()
        {
            // Child classes handle the cleanup.
            OnRemoved();
            return true;
        }

        protected virtual void OnApplied()
        {
        }

        protected virtual void OnRemoved()
        {
        }

        private void ClearOtherModes(BattleUnit target)
        {
            if (target == null)
                return;

            foreach (BattleStatusId modeId in ModeStatuses)
            {
                if (modeId == ThisStatusId)
                    continue;
                target.RemoveStatus(modeId);
            }
        }

    }
}
