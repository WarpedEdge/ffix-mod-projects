using System;
using System.Collections.Generic;
using Assets.Sources.Scripts.UI.Common;
using Memoria;
using Memoria.Assets;
using Memoria.Data;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Firebolt Blade – combines magic sword effect with a follow-up Curse-like weakness debuff.
    /// Ability data must point to script 11003.
    /// </summary>
    [BattleScript(Id)]
    public sealed class FireboltBladeScript : IBattleScript
    {
        public const Int32 Id = 11003;

        private const Byte WeaknessPopupDelay = 20;
        private const String WeaknessPopupColor = "[FF99FD]";
        private const String WeaknessMessageKey = "FireboltBladeWeaknessMessage";
        private const String WeaknessJoinerKey = "FireboltBladeWeaknessJoiner";
        private const String DefaultWeaknessJoiner = " & ";
        private const HUDMessage.MessageStyle WeaknessPopupStyle = HUDMessage.MessageStyle.DAMAGE;

        private readonly BattleCalculator _v;

        public FireboltBladeScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
            _v.Caster.SetLowPhysicalAttack();
            _v.SetWeaponPowerSum();
            _v.Caster.EnemyTranceBonusAttack();
            _v.Target.SetPhysicalDefense();
            _v.BonusElement();

            if (!_v.CanAttackMagic())
                return;

            _v.CalcHpDamage();
            _v.TryAlterMagicStatuses();

            ApplyElementalWeakness();
        }

        private void ApplyElementalWeakness()
        {
            if (_v.Target == null || !_v.Target.IsTargetable)
                return;

            EffectElement element = _v.Command.Element;
            if (element == EffectElement.None)
                return;

            EffectElement alreadyWeak = _v.Target.WeakElement;
            EffectElement newlyApplied = element & ~alreadyWeak;

            _v.Target.WeakElement |= element;
            _v.Target.GuardElement &= ~element;
            _v.Target.AbsorbElement &= ~element;
            _v.Target.HalfElement &= ~element;

            AnnounceElementalWeakness(newlyApplied);
        }

        private void AnnounceElementalWeakness(EffectElement element)
        {
            if (element == EffectElement.None)
                return;

            EffectElement[] flags =
            {
                EffectElement.Fire,
                EffectElement.Cold,
                EffectElement.Thunder,
                EffectElement.Earth,
                EffectElement.Aqua,
                EffectElement.Wind,
                EffectElement.Holy,
                EffectElement.Darkness
            };

            List<String> names = new List<String>(flags.Length);
            foreach (EffectElement flag in flags)
            {
                if ((element & flag) != 0)
                {
                    String attrName = UIManager.Battle.BtlGetAttrName((Int32)flag);
                    if (!String.IsNullOrEmpty(attrName))
                        names.Add(attrName);
                }
            }

            if (names.Count == 0)
                return;

            ShowWeaknessMessages(names);
        }

        private void ShowWeaknessMessages(List<String> elementNames)
        {
            String joiner = GetWeaknessJoiner();
            String combined = String.Join(joiner, elementNames.ToArray());

            String message = FormatWeaknessMessage(GetWeaknessMessageFormat(), combined);

            if (_v.Target?.Data != null && !String.IsNullOrEmpty(message))
                btl2d.Btl2dReqSymbolMessage(_v.Target.Data, WeaknessPopupColor, message, WeaknessPopupStyle, WeaknessPopupDelay);
        }

        private static String GetWeaknessJoiner()
        {
            String joiner = Localization.GetWithDefault(WeaknessJoinerKey);
            if (String.IsNullOrEmpty(joiner) || joiner == WeaknessJoinerKey)
                return DefaultWeaknessJoiner;
            return joiner;
        }

        private static String GetWeaknessMessageFormat()
        {
            String format = Localization.GetWithDefault(WeaknessMessageKey);
            if (String.IsNullOrEmpty(format) || format == WeaknessMessageKey)
                format = GetDefaultWeaknessTemplate();
            return NormalizeWeaknessFormat(format);
        }

        private static String GetDefaultWeaknessTemplate()
        {
            String template = FF9TextTool.BattleFollowText((Int32)(BattleMesages.BecameWeakAgainst + 7));
            if (String.IsNullOrEmpty(template))
                return "{0}";
            return (template.Length > 1) ? template.Substring(1) : template;
        }

        private static String NormalizeWeaknessFormat(String format)
        {
            if (String.IsNullOrEmpty(format))
                return "{0}";

            if (format.Contains("{0}"))
                return format;

            if (format.IndexOf('%') >= 0)
                format = format.Replace("%", "{0}");
            else if (format.IndexOf('&') >= 0)
                format = format.Replace("&", "{0}");
            else
                format += " {0}";

            return format;
        }

        private static String FormatWeaknessMessage(String format, String combinedElements)
        {
            try
            {
                return String.Format(format, combinedElements);
            }
            catch (FormatException)
            {
                return format.Replace("{0}", combinedElements);
            }
        }
    }
}
