using System;
using Memoria;
using Memoria.Data;

namespace Memoria.Scripts.Status
{
    [StatusScript(BattleStatusId.Regen)]
    public sealed class RegenStatusScript : StatusScriptBase, IOprStatusScript
    {
        public IOprStatusScript.SetupOprMethod SetupOpr => null;

        public override uint Apply(BattleUnit target, BattleUnit inflicter, params object[] parameters)
        {
            base.Apply(target, inflicter, parameters);
            return 3u;
        }

        public override bool Remove()
        {
            return true;
        }

        public bool OnOpr()
        {
            if (Target.IsUnderAnyStatus(BattleStatus.Petrify))
                return false;

            uint num = Target.MaximumHp >> 4;
            if (Target.HasSupportAbilityByIndex((SupportAbility)12087)) // Gaia's Blessing SA equipped
                num *= 2;

            bool isDamage = false;
            if (Target.IsUnderAnyStatus(BattleStatus.EasyKill))
                num >>= 2;

            if (Target.IsZombie)
            {
                isDamage = true;
                if (Target.CurrentHp > num)
                {
                    Target.CurrentHp -= num;
                }
                else
                {
                    Target.Kill(Inflicter);
                }
            }
            else
            {
                Target.CurrentHp = Math.Min(Target.CurrentHp + num, Target.MaximumHp);
            }

            btl2d.Btl2dStatReq(Target, (int)(isDamage ? num : (0 - num)), 0);
            BattleVoice.TriggerOnStatusChange(Target, BattleVoice.BattleMoment.Used, BattleStatusId.Regen);
            return false;
        }
    }
}
